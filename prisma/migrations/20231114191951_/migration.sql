/*
  Warnings:

  - The primary key for the `testID` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "testID" DROP CONSTRAINT "testID_pkey",
ALTER COLUMN "uid" SET DATA TYPE TEXT,
ADD CONSTRAINT "testID_pkey" PRIMARY KEY ("uid");
