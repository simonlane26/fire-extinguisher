-- CreateTable FireDoorPhoto
CREATE TABLE IF NOT EXISTS "public"."FireDoorPhoto" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "doorId" TEXT NOT NULL,
    "inspectionId" TEXT,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FireDoorPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "FireDoorPhoto_tenantId_idx" ON "public"."FireDoorPhoto"("tenantId");
CREATE INDEX IF NOT EXISTS "FireDoorPhoto_doorId_idx" ON "public"."FireDoorPhoto"("doorId");
CREATE INDEX IF NOT EXISTS "FireDoorPhoto_inspectionId_idx" ON "public"."FireDoorPhoto"("inspectionId");

-- AddForeignKeys
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FireDoorPhoto_tenantId_fkey') THEN
        ALTER TABLE "public"."FireDoorPhoto" ADD CONSTRAINT "FireDoorPhoto_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FireDoorPhoto_doorId_fkey') THEN
        ALTER TABLE "public"."FireDoorPhoto" ADD CONSTRAINT "FireDoorPhoto_doorId_fkey"
        FOREIGN KEY ("doorId") REFERENCES "public"."FireDoor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FireDoorPhoto_inspectionId_fkey') THEN
        ALTER TABLE "public"."FireDoorPhoto" ADD CONSTRAINT "FireDoorPhoto_inspectionId_fkey"
        FOREIGN KEY ("inspectionId") REFERENCES "public"."FireDoorInspection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
