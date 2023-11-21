/*
  Warnings:

  - You are about to drop the column `userId` on the `testID` table. All the data in the column will be lost.
  - Added the required column `applicantID` to the `testID` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "testID" DROP CONSTRAINT "testID_userId_fkey";

-- AlterTable
ALTER TABLE "testID" DROP COLUMN "userId",
ADD COLUMN     "applicantID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");

-- AddForeignKey
ALTER TABLE "testID" ADD CONSTRAINT "testID_applicantID_fkey" FOREIGN KEY ("applicantID") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
