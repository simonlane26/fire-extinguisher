-- Add deviceName column to PushSubscription table
ALTER TABLE "PushSubscription" ADD COLUMN IF NOT EXISTS "deviceName" TEXT;
