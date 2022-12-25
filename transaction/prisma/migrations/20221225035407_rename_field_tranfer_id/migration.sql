/*
  Warnings:

  - You are about to drop the column `transferType` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `tranferTypeId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `transactionStatus` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transferType",
ADD COLUMN     "tranferTypeId" INTEGER NOT NULL,
ALTER COLUMN "transactionStatus" SET NOT NULL;
