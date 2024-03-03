/*
  Warnings:

  - You are about to drop the column `expirationDate` on the `testID` table. All the data in the column will be lost.
  - Added the required column `templateID` to the `testID` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "testID" DROP COLUMN "expirationDate",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "templateID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "testID" ADD CONSTRAINT "testID_templateID_fkey" FOREIGN KEY ("templateID") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
