/*
  Warnings:

  - A unique constraint covering the columns `[applicantID]` on the table `testID` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Applicant" ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Sent';

-- CreateIndex
CREATE UNIQUE INDEX "testID_applicantID_key" ON "testID"("applicantID");
