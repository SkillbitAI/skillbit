/*
  Warnings:

  - You are about to drop the column `applicantID` on the `testID` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[testID]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `testID` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `testID` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "testID" DROP CONSTRAINT "testID_applicantID_fkey";

-- DropIndex
DROP INDEX "testID_applicantID_key";

-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "testID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "testID" DROP COLUMN "applicantID";

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_testID_key" ON "Applicant"("testID");

-- CreateIndex
CREATE UNIQUE INDEX "testID_uid_key" ON "testID"("uid");

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_testID_fkey" FOREIGN KEY ("testID") REFERENCES "testID"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
