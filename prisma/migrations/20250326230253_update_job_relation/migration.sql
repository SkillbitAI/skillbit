-- DropForeignKey
ALTER TABLE "testID" DROP CONSTRAINT "testID_jobId_fkey";

-- AddForeignKey
ALTER TABLE "testID" ADD CONSTRAINT "testID_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
