-- Add missing columns to ServiceJob table
ALTER TABLE "public"."ServiceJob"
ADD COLUMN IF NOT EXISTS "location" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "building" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS "serviceType" TEXT NOT NULL DEFAULT 'Inspection';

-- Update status column default if needed
ALTER TABLE "public"."ServiceJob"
ALTER COLUMN "status" SET DEFAULT 'pending';

-- Add missing columns with nullable first, then update and make required
ALTER TABLE "public"."ServiceJob"
ADD COLUMN IF NOT EXISTS "notes" TEXT,
ADD COLUMN IF NOT EXISTS "scheduledDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "completedDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "technician" TEXT;
