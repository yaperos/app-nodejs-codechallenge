/*
  Warnings:

  - You are about to drop the column `transferTypeId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `tranferTypeId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transferTypeId",
ADD COLUMN     "tranferTypeId" INTEGER NOT NULL;
