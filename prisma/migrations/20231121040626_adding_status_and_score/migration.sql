/*
  Warnings:

  - Added the required column `score` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "score" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
