/*
  Warnings:

  - Added the required column `userId` to the `testID` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "testID" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "testID" ADD CONSTRAINT "testID_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
