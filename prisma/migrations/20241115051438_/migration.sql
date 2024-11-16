/*
  Warnings:

  - You are about to drop the `Applicant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `testID` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `testID` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `testID` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_testID_fkey";

-- AlterTable
ALTER TABLE "testID" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "score" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Unsent';

-- DropTable
DROP TABLE "Applicant";
