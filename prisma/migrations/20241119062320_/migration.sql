/*
  Warnings:

  - Made the column `prompt` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "prompt" SET NOT NULL,
ALTER COLUMN "prompt" SET DEFAULT '';
