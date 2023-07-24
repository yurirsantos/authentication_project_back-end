/*
  Warnings:

  - You are about to drop the column `ddd` on the `Contacts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contact]` on the table `Contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Contacts" DROP COLUMN "ddd";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "receiveOffers" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_contact_key" ON "Contacts"("contact");
