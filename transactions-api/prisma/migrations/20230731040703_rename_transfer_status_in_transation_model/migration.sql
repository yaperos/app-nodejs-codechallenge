/*
  Warnings:

  - You are about to drop the column `transferStatus` on the `Transaction` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "transferStatus",
ADD COLUMN     "transactionStatus" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "TransferStatus";
