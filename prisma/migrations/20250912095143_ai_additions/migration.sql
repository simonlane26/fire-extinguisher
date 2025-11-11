-- CreateTable
CREATE TABLE "public"."InspectionPhoto" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "extinguisherId" TEXT,
    "url" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "labels" TEXT[],
    "findings" JSONB,
    "annotatedUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InspectionPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceJob" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "extinguisherId" TEXT,
    "rawInput" TEXT NOT NULL,
    "structured" JSONB,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceReport" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "technician" TEXT,
    "jobIds" TEXT[],
    "pdfUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InspectionPhoto_tenantId_extinguisherId_idx" ON "public"."InspectionPhoto"("tenantId", "extinguisherId");

-- CreateIndex
CREATE INDEX "ServiceJob_tenantId_extinguisherId_idx" ON "public"."ServiceJob"("tenantId", "extinguisherId");

-- CreateIndex
CREATE INDEX "ServiceReport_tenantId_idx" ON "public"."ServiceReport"("tenantId");

-- AddForeignKey
ALTER TABLE "public"."InspectionPhoto" ADD CONSTRAINT "InspectionPhoto_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InspectionPhoto" ADD CONSTRAINT "InspectionPhoto_extinguisherId_fkey" FOREIGN KEY ("extinguisherId") REFERENCES "public"."Extinguisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceJob" ADD CONSTRAINT "ServiceJob_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceJob" ADD CONSTRAINT "ServiceJob_extinguisherId_fkey" FOREIGN KEY ("extinguisherId") REFERENCES "public"."Extinguisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceReport" ADD CONSTRAINT "ServiceReport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
