-- CreateTable
CREATE TABLE "Company" (
    "name" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "uuid" SERIAL NOT NULL,
    "companyID" INTEGER NOT NULL,
    "regTS" TEXT NOT NULL,
    "activeStatus" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "LoginTable" (
    "id" SERIAL NOT NULL,
    "timeLogged" TEXT,
    "ipAddr" TEXT,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "LoginTable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_id_key" ON "Company"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LoginTable_id_key" ON "LoginTable"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginTable" ADD CONSTRAINT "LoginTable_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
