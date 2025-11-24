-- AlterTable Tenant - Add contact and Stripe fields
ALTER TABLE "public"."Tenant" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
ALTER TABLE "public"."Tenant" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
ALTER TABLE "public"."Tenant" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;

-- Create unique indexes for Stripe fields
CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_stripeCustomerId_key" ON "public"."Tenant"("stripeCustomerId");
CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_stripeSubscriptionId_key" ON "public"."Tenant"("stripeSubscriptionId");
