/*
  Warnings:

  - You are about to drop the column `transactionType` on the `YapeTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "YapeTransaction" DROP COLUMN "transactionType",
ADD COLUMN     "tranferTypeId" INTEGER NOT NULL DEFAULT 1;
