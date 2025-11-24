-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP(3);
