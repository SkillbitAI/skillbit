-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyID" TEXT NOT NULL DEFAULT 'Skillbit';

-- AlterTable
ALTER TABLE "testID" ADD COLUMN     "companyID" TEXT NOT NULL DEFAULT 'Skillbit';

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testID" ADD CONSTRAINT "testID_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
