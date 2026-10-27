-- AddColumn: tenant-wide compliance standard selection (BS 5306-3 / IS 291)
ALTER TABLE "public"."Tenant"
  ADD COLUMN IF NOT EXISTS "complianceStandard" TEXT NOT NULL DEFAULT 'BS';

-- AddColumn: extinguisher manufacture date, needed for IS 291's 10-year-from-manufacture cutoff
ALTER TABLE "public"."Extinguisher"
  ADD COLUMN IF NOT EXISTS "manufactureDate" TIMESTAMP(3);
