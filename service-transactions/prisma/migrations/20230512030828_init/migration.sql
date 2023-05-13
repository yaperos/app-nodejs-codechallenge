-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Transaction" (
    "transactionExternalId" SERIAL NOT NULL,
    "accountExternalIdDebit" TEXT NOT NULL,
    "accountExternalIdCredit" TEXT NOT NULL,
    "transferTypeId" INTEGER NOT NULL DEFAULT 1,
    "value" INTEGER NOT NULL DEFAULT 1,
    "transactionStatus" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionExternalId")
);

-- CreateTable
CREATE TABLE "TransactionType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TransactionType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transferTypeId_fkey" FOREIGN KEY ("transferTypeId") REFERENCES "TransactionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
