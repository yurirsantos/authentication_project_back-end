/*
  Warnings:

  - You are about to drop the `PasswordChangeCodes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PasswordChangeCodes" DROP CONSTRAINT "PasswordChangeCodes_userId_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "PasswordChangeCodes";

-- CreateTable
CREATE TABLE "ChangeCodes" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangeCodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChangeCodes" ADD CONSTRAINT "ChangeCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
