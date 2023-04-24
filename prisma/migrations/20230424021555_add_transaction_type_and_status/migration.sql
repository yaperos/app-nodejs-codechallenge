/*
  Warnings:

  - You are about to drop the column `tranferTypeId` on the `YapeTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionStatus` on the `YapeTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "YapeTransaction" DROP COLUMN "tranferTypeId",
DROP COLUMN "transactionStatus",
ADD COLUMN     "transactionStatusId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "transferTypeId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "TransactionStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "YapeTransaction" ADD CONSTRAINT "YapeTransaction_transferTypeId_fkey" FOREIGN KEY ("transferTypeId") REFERENCES "TransactionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YapeTransaction" ADD CONSTRAINT "YapeTransaction_transactionStatusId_fkey" FOREIGN KEY ("transactionStatusId") REFERENCES "TransactionStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
