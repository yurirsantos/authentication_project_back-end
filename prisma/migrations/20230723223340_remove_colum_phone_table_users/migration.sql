/*
  Warnings:

  - You are about to drop the column `phone` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Users_phone_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "phone";

-- CreateTable
CREATE TABLE "Contacts" (
    "id" TEXT NOT NULL,
    "codCountry" TEXT NOT NULL,
    "ddd" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
