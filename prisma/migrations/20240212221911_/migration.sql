/*
  Warnings:

  - A unique constraint covering the columns `[join_code]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "join_code" TEXT NOT NULL DEFAULT '000000';

-- CreateIndex
CREATE UNIQUE INDEX "Company_join_code_key" ON "Company"("join_code");
