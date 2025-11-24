-- AlterTable Extinguisher - Add missing fields
ALTER TABLE "public"."Extinguisher" ADD COLUMN IF NOT EXISTS "siteId" TEXT;
ALTER TABLE "public"."Extinguisher" ADD COLUMN IF NOT EXISTS "weight" TEXT;

-- AddForeignKey for siteId
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Extinguisher_siteId_fkey') THEN
        ALTER TABLE "public"."Extinguisher" ADD CONSTRAINT "Extinguisher_siteId_fkey"
        FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Extinguisher_siteId_idx" ON "public"."Extinguisher"("siteId");
