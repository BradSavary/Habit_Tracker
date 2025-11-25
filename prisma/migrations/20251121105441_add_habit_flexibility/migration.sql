-- AlterTable
ALTER TABLE "habits" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "monthDays" JSONB,
ADD COLUMN     "weeklyGoal" INTEGER;
