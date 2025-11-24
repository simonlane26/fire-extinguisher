-- CreateTable InventoryItem
CREATE TABLE IF NOT EXISTS "public"."InventoryItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "partNumber" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "unitPrice" DOUBLE PRECISION,
    "quantityInStock" INTEGER NOT NULL DEFAULT 0,
    "minStockLevel" INTEGER NOT NULL DEFAULT 10,
    "supplier" TEXT,
    "supplierPartNo" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable PartUsage
CREATE TABLE IF NOT EXISTS "public"."PartUsage" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "extinguisherId" TEXT,
    "inspectionId" TEXT,
    "quantityUsed" INTEGER NOT NULL,
    "usedBy" TEXT,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PartUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable PushSubscription
CREATE TABLE IF NOT EXISTS "public"."PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes for InventoryItem
CREATE UNIQUE INDEX IF NOT EXISTS "InventoryItem_tenantId_partNumber_key" ON "public"."InventoryItem"("tenantId", "partNumber");
CREATE INDEX IF NOT EXISTS "InventoryItem_tenantId_idx" ON "public"."InventoryItem"("tenantId");

-- CreateIndexes for PartUsage
CREATE INDEX IF NOT EXISTS "PartUsage_tenantId_idx" ON "public"."PartUsage"("tenantId");
CREATE INDEX IF NOT EXISTS "PartUsage_inventoryItemId_idx" ON "public"."PartUsage"("inventoryItemId");
CREATE INDEX IF NOT EXISTS "PartUsage_extinguisherId_idx" ON "public"."PartUsage"("extinguisherId");

-- CreateIndexes for PushSubscription
CREATE UNIQUE INDEX IF NOT EXISTS "PushSubscription_endpoint_key" ON "public"."PushSubscription"("endpoint");
CREATE INDEX IF NOT EXISTS "PushSubscription_userId_idx" ON "public"."PushSubscription"("userId");
CREATE INDEX IF NOT EXISTS "PushSubscription_tenantId_idx" ON "public"."PushSubscription"("tenantId");

-- AddForeignKeys
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InventoryItem_tenantId_fkey') THEN
        ALTER TABLE "public"."InventoryItem" ADD CONSTRAINT "InventoryItem_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PartUsage_tenantId_fkey') THEN
        ALTER TABLE "public"."PartUsage" ADD CONSTRAINT "PartUsage_tenantId_fkey"
        FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PartUsage_inventoryItemId_fkey') THEN
        ALTER TABLE "public"."PartUsage" ADD CONSTRAINT "PartUsage_inventoryItemId_fkey"
        FOREIGN KEY ("inventoryItemId") REFERENCES "public"."InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
