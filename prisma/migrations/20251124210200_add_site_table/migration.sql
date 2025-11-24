-- CreateTable Site
CREATE TABLE IF NOT EXISTS "public"."Site" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "postcode" TEXT,
    "country" TEXT DEFAULT 'UK',
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Site_tenantId_idx" ON "public"."Site"("tenantId");

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Site_tenantId_fkey') THEN
        ALTER TABLE "public"."Site" ADD CONSTRAINT "Site_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Now add the foreign key from Extinguisher to Site (if it doesn't exist)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Extinguisher_siteId_fkey') THEN
        ALTER TABLE "public"."Extinguisher" ADD CONSTRAINT "Extinguisher_siteId_fkey"
        FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
