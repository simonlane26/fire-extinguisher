-- AddColumn: fire doors feature flag
ALTER TABLE "public"."Tenant" ADD COLUMN IF NOT EXISTS "fireDoorsEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable FireDoor
CREATE TABLE IF NOT EXISTS "public"."FireDoor" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "doorRef" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "doorType" TEXT NOT NULL,
    "fireRating" TEXT,
    "manufacturer" TEXT,
    "installationDate" TIMESTAMP(3),
    "hasIntumescentStrips" BOOLEAN NOT NULL DEFAULT false,
    "hasSmokeSeal" BOOLEAN NOT NULL DEFAULT false,
    "hasLetterbox" BOOLEAN NOT NULL DEFAULT false,
    "hasAirTransferGrille" BOOLEAN NOT NULL DEFAULT false,
    "hasGlazing" BOOLEAN NOT NULL DEFAULT false,
    "inspectionFrequencyMonths" INTEGER NOT NULL DEFAULT 12,
    "nextInspectionDue" TIMESTAMP(3),
    "lastInspectedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FireDoor_pkey" PRIMARY KEY ("id")
);

-- CreateTable FireDoorInspection
CREATE TABLE IF NOT EXISTS "public"."FireDoorInspection" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "doorId" TEXT NOT NULL,
    "inspectedBy" TEXT NOT NULL,
    "inspectedAt" TIMESTAMP(3) NOT NULL,
    "accessDenied" BOOLEAN NOT NULL DEFAULT false,
    "accessDeniedReason" TEXT,
    "visualDamage" BOOLEAN,
    "closesCompletely" BOOLEAN,
    "closesFromAnyAngle" BOOLEAN,
    "opensInTravelDirection" BOOLEAN,
    "frameGapOk" BOOLEAN,
    "maxGapSizeMm" DOUBLE PRECISION,
    "hingesSecure" BOOLEAN,
    "hingeCount" INTEGER,
    "selfCloserWorks" BOOLEAN,
    "intumescentStripIntact" BOOLEAN,
    "smokeSealIntact" BOOLEAN,
    "letterboxCloses" BOOLEAN,
    "airTransferGrilleOk" BOOLEAN,
    "glazingIntact" BOOLEAN,
    "signageCorrect" BOOLEAN,
    "outcome" TEXT NOT NULL,
    "defectsFound" TEXT,
    "remedialAction" TEXT,
    "actionPriority" TEXT,
    "comments" TEXT,
    "nextInspectionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FireDoorInspection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "FireDoor_tenantId_idx" ON "public"."FireDoor"("tenantId");
CREATE INDEX IF NOT EXISTS "FireDoor_siteId_idx" ON "public"."FireDoor"("siteId");
CREATE INDEX IF NOT EXISTS "FireDoorInspection_tenantId_idx" ON "public"."FireDoorInspection"("tenantId");
CREATE INDEX IF NOT EXISTS "FireDoorInspection_doorId_idx" ON "public"."FireDoorInspection"("doorId");

-- AddForeignKeys
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FireDoor_tenantId_fkey') THEN
        ALTER TABLE "public"."FireDoor" ADD CONSTRAINT "FireDoor_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FireDoor_siteId_fkey') THEN
        ALTER TABLE "public"."FireDoor" ADD CONSTRAINT "FireDoor_siteId_fkey"
        FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FireDoorInspection_tenantId_fkey') THEN
        ALTER TABLE "public"."FireDoorInspection" ADD CONSTRAINT "FireDoorInspection_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FireDoorInspection_doorId_fkey') THEN
        ALTER TABLE "public"."FireDoorInspection" ADD CONSTRAINT "FireDoorInspection_doorId_fkey"
        FOREIGN KEY ("doorId") REFERENCES "public"."FireDoor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
