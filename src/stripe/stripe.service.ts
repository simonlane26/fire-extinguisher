// src/stripe/stripe.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

export type SubscriptionPlan = 'trial' | 'starter' | 'professional' | 'enterprise';

export interface PlanLimits {
  maxExtinguishers: number;
  maxUsers: number;
  features: string[];
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  trial: {
    maxExtinguishers: 10,
    maxUsers: 1,
    features: ['QR generation (limited)', 'Basic reports'],
  },
  starter: {
    maxExtinguishers: 50,
    maxUsers: 3,
    features: ['Standard dashboard', 'Email reminders', 'QR generation', 'Basic reports'],
  },
  professional: {
    maxExtinguishers: 250,
    maxUsers: 10,
    features: ['Advanced analytics', 'Custom branding', 'Export to PDF/CSV', 'Priority email support'],
  },
  enterprise: {
    maxExtinguishers: 1000,
    maxUsers: -1, // unlimited
    features: ['Multi-tenant management', 'API access', 'Custom domain', 'Priority support', 'SSO', 'Audit logs', 'SLA'],
  },
};

export const STRIPE_PRICE_IDS = {
  starter_monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || '',
  starter_annual: process.env.STRIPE_PRICE_STARTER_ANNUAL || '',
  professional_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
  professional_annual: process.env.STRIPE_PRICE_PRO_ANNUAL || '',
  enterprise_monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || '',
  enterprise_annual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL || '',
};

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.warn('⚠️  STRIPE_SECRET_KEY not configured. Billing features will be disabled.');
      return;
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  isConfigured(): boolean {
    return !!this.stripe;
  }

  /**
   * Create a Stripe checkout session for a subscription
   */
  async createCheckoutSession(params: {
    tenantId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    if (!this.isConfigured()) {
      throw new Error('Stripe is not configured');
    }

    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: params.tenantId },
    });

    // Get or create Stripe customer
    let customerId = tenant.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: tenant.contactEmail || undefined,
        metadata: {
          tenantId: tenant.id,
        },
      });
      customerId = customer.id;
      await this.prisma.tenant.update({
        where: { id: tenant.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        tenantId: params.tenantId,
      },
    });

    return session;
  }

  /**
   * Create a billing portal session for managing subscription
   */
  async createPortalSession(params: {
    tenantId: string;
    returnUrl: string;
  }) {
    if (!this.isConfigured()) {
      throw new Error('Stripe is not configured');
    }

    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: params.tenantId },
    });

    if (!tenant.stripeCustomerId) {
      throw new Error('No Stripe customer found for this tenant');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: tenant.stripeCustomerId,
      return_url: params.returnUrl,
    });

    return session;
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(event: Stripe.Event) {
    if (!this.isConfigured()) {
      throw new Error('Stripe is not configured');
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const tenantId = subscription.metadata.tenantId;
    if (!tenantId) {
      console.error('No tenantId in subscription metadata');
      return;
    }

    const priceId = subscription.items.data[0]?.price.id;
    const plan = this.getPlanFromPriceId(priceId);

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        stripeSubscriptionId: subscription.id,
        subscriptionPlan: plan,
        subscriptionStatus: subscription.status as any,
      },
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const tenantId = subscription.metadata.tenantId;
    if (!tenantId) return;

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionPlan: 'trial',
        subscriptionStatus: 'canceled',
      },
    });
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const tenantId = session.metadata?.tenantId;
    if (!tenantId) return;

    // Subscription details will be updated via subscription.created event
    console.log(`Checkout completed for tenant ${tenantId}`);
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    console.log(`Payment succeeded for invoice ${invoice.id}`);
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;
    const tenant = await this.prisma.tenant.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (tenant) {
      await this.prisma.tenant.update({
        where: { id: tenant.id },
        data: { subscriptionStatus: 'past_due' },
      });
    }
  }

  private getPlanFromPriceId(priceId?: string): SubscriptionPlan {
    if (!priceId) return 'trial';

    if (priceId === STRIPE_PRICE_IDS.starter_monthly || priceId === STRIPE_PRICE_IDS.starter_annual) {
      return 'starter';
    }
    if (priceId === STRIPE_PRICE_IDS.professional_monthly || priceId === STRIPE_PRICE_IDS.professional_annual) {
      return 'professional';
    }
    if (priceId === STRIPE_PRICE_IDS.enterprise_monthly || priceId === STRIPE_PRICE_IDS.enterprise_annual) {
      return 'enterprise';
    }

    return 'trial';
  }

  /**
   * Get plan limits for a tenant
   */
  getPlanLimits(plan: SubscriptionPlan): PlanLimits {
    return PLAN_LIMITS[plan];
  }

  /**
   * Check if tenant can add more extinguishers
   */
  async canAddExtinguisher(tenantId: string): Promise<boolean> {
    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
    });

    const limits = this.getPlanLimits(tenant.subscriptionPlan);
    const currentCount = await this.prisma.extinguisher.count({
      where: { tenantId },
    });

    return currentCount < limits.maxExtinguishers;
  }

  /**
   * Check if tenant can add more users
   */
  async canAddUser(tenantId: string): Promise<boolean> {
    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
    });

    const limits = this.getPlanLimits(tenant.subscriptionPlan);

    // Unlimited users
    if (limits.maxUsers === -1) {
      return true;
    }

    const currentCount = await this.prisma.user.count({
      where: { tenantId },
    });

    return currentCount < limits.maxUsers;
  }
}
