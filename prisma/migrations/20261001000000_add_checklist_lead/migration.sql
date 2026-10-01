-- CreateTable ChecklistLead
CREATE TABLE IF NOT EXISTS "public"."ChecklistLead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'homepage',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChecklistLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ChecklistLead_email_key" ON "public"."ChecklistLead"("email");
CREATE INDEX IF NOT EXISTS "ChecklistLead_email_idx" ON "public"."ChecklistLead"("email");
