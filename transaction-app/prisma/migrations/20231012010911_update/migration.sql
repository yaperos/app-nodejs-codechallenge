/*
  Warnings:

  - Changed the type of `transactionType` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `transactionStatus` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transactionType",
ADD COLUMN     "transactionType" "TransactionType" NOT NULL,
DROP COLUMN "transactionStatus",
ADD COLUMN     "transactionStatus" "TransactionStatus" NOT NULL;
