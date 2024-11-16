/*
  Warnings:

  - The primary key for the `testID` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `testID` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `testID` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `testID` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_testID_fkey";

-- DropIndex
DROP INDEX "testID_uid_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "testID" DROP CONSTRAINT "testID_pkey",
DROP COLUMN "uid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "testID_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "testID_id_key" ON "testID"("id");

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_testID_fkey" FOREIGN KEY ("testID") REFERENCES "testID"("id") ON DELETE CASCADE ON UPDATE CASCADE;
