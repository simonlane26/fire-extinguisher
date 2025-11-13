// src/stripe/stripe.controller.ts
import { Body, Controller, Post, Headers, RawBodyRequest, Req, UseGuards } from '@nestjs/common';
import { StripeService, STRIPE_PRICE_IDS } from './stripe.service';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { TenantGuard } from '../auth/tenant.guard';
import { Request } from 'express';
import Stripe from 'stripe';

@Controller('billing')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  @UseGuards(TenantGuard)
  async createCheckoutSession(
    @CurrentUser() user: CurrentUserData,
    @Body() body: { priceId: string; returnUrl: string }
  ) {
    if (!this.stripeService.isConfigured()) {
      return { error: 'Billing is not configured' };
    }

    const session = await this.stripeService.createCheckoutSession({
      tenantId: user.tenantId,
      priceId: body.priceId,
      successUrl: `${body.returnUrl}?success=true`,
      cancelUrl: `${body.returnUrl}?canceled=true`,
    });

    return { sessionId: session.id, url: session.url };
  }

  @Post('create-portal-session')
  @UseGuards(TenantGuard)
  async createPortalSession(
    @CurrentUser() user: CurrentUserData,
    @Body() body: { returnUrl: string }
  ) {
    if (!this.stripeService.isConfigured()) {
      return { error: 'Billing is not configured' };
    }

    const session = await this.stripeService.createPortalSession({
      tenantId: user.tenantId,
      returnUrl: body.returnUrl,
    });

    return { url: session.url };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    if (!this.stripeService.isConfigured()) {
      return { error: 'Billing is not configured' };
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    let event: Stripe.Event;

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-10-29.clover',
      });

      event = stripe.webhooks.constructEvent(
        req.rawBody!,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      throw new Error('Invalid signature');
    }

    await this.stripeService.handleWebhook(event);

    return { received: true };
  }

  @Post('get-prices')
  getPrices() {
    return {
      prices: STRIPE_PRICE_IDS,
      plans: {
        starter: {
          name: 'Starter',
          monthlyPrice: '£19/mo',
          annualPrice: '£190/yr',
          limits: {
            extinguishers: 50,
            users: 3,
          },
          features: [
            'Up to 50 extinguishers',
            '3 users',
            'Standard dashboard',
            'Email reminders',
            'QR generation',
            'Basic reports',
          ],
        },
        professional: {
          name: 'Professional',
          monthlyPrice: '£49/mo',
          annualPrice: '£490/yr',
          limits: {
            extinguishers: 250,
            users: 10,
          },
          features: [
            'Up to 250 extinguishers',
            '10 users',
            'Advanced analytics',
            'Custom branding',
            'Export to PDF/CSV',
            'Priority email support',
          ],
        },
        enterprise: {
          name: 'Business',
          monthlyPrice: '£99/mo',
          annualPrice: '£990/yr',
          limits: {
            extinguishers: 1000,
            users: 'Unlimited',
          },
          features: [
            'Up to 1,000 extinguishers',
            'Unlimited users',
            'API access',
            'Custom domain/subdomain',
            'Priority support',
          ],
        },
      },
    };
  }
}
