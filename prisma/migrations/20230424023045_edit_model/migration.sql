/*
  Warnings:

  - You are about to drop the column `transferTypeId` on the `YapeTransaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "YapeTransaction" DROP CONSTRAINT "YapeTransaction_transferTypeId_fkey";

-- AlterTable
ALTER TABLE "YapeTransaction" DROP COLUMN "transferTypeId",
ADD COLUMN     "tranferTypeId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "YapeTransaction" ADD CONSTRAINT "YapeTransaction_tranferTypeId_fkey" FOREIGN KEY ("tranferTypeId") REFERENCES "TransactionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
