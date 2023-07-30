-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Transactions" (
    "transactionExternalId" TEXT NOT NULL,
    "tranferTypeId" INTEGER NOT NULL,
    "value" DECIMAL(9,2) NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_transactionExternalId_key" ON "Transactions"("transactionExternalId");
