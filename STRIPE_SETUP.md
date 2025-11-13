# Stripe Integration Setup Guide

This guide will walk you through setting up Stripe for subscription billing in your Fire Extinguisher Management System.

## Prerequisites

- A Stripe account (sign up at [stripe.com](https://stripe.com))
- Access to your Stripe Dashboard

## Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers → API keys**
3. Copy your **Secret key** (starts with `sk_test_` for test mode)
4. Add to your `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   ```

## Step 2: Create Products and Prices

### Starter Plan
1. Go to [Products](https://dashboard.stripe.com/products)
2. Click **+ Add product**
3. Fill in:
   - **Name**: Starter Plan
   - **Description**: Up to 50 extinguishers, 3 users
   - **Pricing**:
     - **Monthly**: £19/month
     - **Annual**: £190/year (create as a separate price)
4. Save and copy the Price IDs:
   ```
   STRIPE_PRICE_STARTER_MONTHLY=price_xxxxxxxxxxxxx
   STRIPE_PRICE_STARTER_ANNUAL=price_xxxxxxxxxxxxx
   ```

### Professional Plan
1. Create another product:
   - **Name**: Professional Plan
   - **Description**: Up to 250 extinguishers, 10 users
   - **Pricing**:
     - **Monthly**: £49/month
     - **Annual**: £490/year
2. Copy the Price IDs:
   ```
   STRIPE_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxxx
   STRIPE_PRICE_PRO_ANNUAL=price_xxxxxxxxxxxxx
   ```

### Business Plan
1. Create another product:
   - **Name**: Business Plan
   - **Description**: Up to 1,000 extinguishers, unlimited users
   - **Pricing**:
     - **Monthly**: £99/month
     - **Annual**: £990/year
2. Copy the Price IDs:
   ```
   STRIPE_PRICE_BUSINESS_MONTHLY=price_xxxxxxxxxxxxx
   STRIPE_PRICE_BUSINESS_ANNUAL=price_xxxxxxxxxxxxx
   ```

## Step 3: Set Up Webhooks

Webhooks allow Stripe to notify your application about subscription changes.

1. Go to [Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **+ Add endpoint**
3. Enter your endpoint URL:
   ```
   https://yourdomain.com/api/v1/billing/webhook
   ```
   (For local development, use [Stripe CLI](https://stripe.com/docs/stripe-cli) or a tunnel service like ngrok)
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to your `.env` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## Step 4: Enable Customer Portal

The Customer Portal allows customers to manage their subscriptions.

1. Go to [Customer Portal Settings](https://dashboard.stripe.com/settings/billing/portal)
2. Click **Activate link**
3. Configure:
   - ✅ Allow customers to update their payment methods
   - ✅ Allow customers to update subscription quantities
   - ✅ Allow customers to switch plans
   - ✅ Allow customers to cancel subscriptions
4. Save changes

## Step 5: Test Mode vs Production

### Test Mode (Development)
- Use test API keys (starts with `sk_test_`)
- Use test cards from [Stripe Testing](https://stripe.com/docs/testing):
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`
  - 3D Secure: `4000 0027 6000 3184`

### Production Mode
1. Switch to **Production** in Stripe Dashboard (top right toggle)
2. Get your production API keys
3. Update your `.env` file with production keys
4. Create production webhook endpoint
5. Update price IDs to production versions

## Step 6: Update Database Schema

Make sure your Prisma schema includes Stripe fields:

```prisma
model Tenant {
  id                   String    @id @default(uuid())
  // ... other fields
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  subscriptionPlan     String    @default("trial")
  subscriptionStatus   String    @default("trial")
}
```

Run migrations if needed:
```bash
npx prisma migrate dev
```

## Step 7: Testing the Integration

1. Start your backend:
   ```bash
   npm run backend
   ```

2. Start your frontend:
   ```bash
   cd frontend && npm run dev
   ```

3. Log in to the application
4. Navigate to the **Billing** tab
5. Click **Subscribe** on a plan
6. Use a test card to complete checkout
7. Verify the subscription appears in your Stripe Dashboard

## Subscription Plans

| Plan | Monthly | Annual | Extinguishers | Users | Features |
|------|---------|--------|---------------|-------|----------|
| **Trial** | Free | - | 10 | 1 | Basic features, limited QR |
| **Starter** | £19 | £190 | 50 | 3 | Email reminders, reports |
| **Professional** | £49 | £490 | 250 | 10 | Analytics, custom branding |
| **Business** | £99 | £990 | 1,000 | Unlimited | API, custom domain, priority support |
| **Enterprise** | Custom | Custom | Unlimited | Unlimited | SSO, audit logs, SLA |

## Usage Limits Enforcement

The system automatically enforces limits based on subscription plans:

- **Extinguishers**: Users cannot add more than their plan allows
- **Users**: Admins cannot create more users than allowed
- Users are prompted to upgrade when hitting limits

## Webhook Security

The webhook endpoint verifies all requests using the webhook secret. Never skip signature verification in production!

## Troubleshooting

### Webhook not receiving events
- Check the endpoint URL is publicly accessible
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/v1/billing/webhook`
- Verify webhook secret is correct

### Subscription not updating in database
- Check server logs for webhook errors
- Verify Prisma migrations are up to date
- Check that tenantId is included in subscription metadata

### Payment failing
- Verify test cards are being used in test mode
- Check Stripe Dashboard for declined reasons
- Ensure customer has a valid payment method

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Subscription Lifecycle](https://stripe.com/docs/billing/subscriptions/overview)
- [Testing Subscriptions](https://stripe.com/docs/billing/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

## Support

For issues with Stripe integration, check:
1. Server logs for error messages
2. Stripe Dashboard → Logs for API requests
3. Webhook delivery logs for failed webhooks
