-- Add lastUsed column to PushSubscription table
ALTER TABLE "PushSubscription" ADD COLUMN IF NOT EXISTS "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
