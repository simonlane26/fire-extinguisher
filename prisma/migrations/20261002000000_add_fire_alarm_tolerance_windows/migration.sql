-- AddColumn: tolerance windows for fire alarm test schedules
ALTER TABLE "public"."FireAlarmSystem"
  ADD COLUMN IF NOT EXISTS "weeklyToleranceDays" INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS "monthlyToleranceDays" INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS "quarterlyToleranceDays" INTEGER NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS "sixMonthlyToleranceDays" INTEGER NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS "annualToleranceDays" INTEGER NOT NULL DEFAULT 60;
