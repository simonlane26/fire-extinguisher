-- Mark the failed migration as resolved by applying the fix
-- AlterTable Extinguisher - Add missing fields (without foreign key constraint)
ALTER TABLE "public"."Extinguisher" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "public"."Extinguisher" ADD COLUMN IF NOT EXISTS "weight" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Extinguisher_siteId_idx" ON "public"."Extinguisher"("siteId");
