-- AlterTable
ALTER TABLE "habits" ADD COLUMN     "category" TEXT,
ADD COLUMN     "emoji" TEXT,
ADD COLUMN     "monthlyGoal" INTEGER,
ADD COLUMN     "weekDays" JSONB;

-- CreateTable
CREATE TABLE "mood_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mood_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mood_entries_userId_date_key" ON "mood_entries"("userId", "date");
