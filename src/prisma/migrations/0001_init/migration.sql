-- CreateEnum
CREATE TYPE "TransactionStatusName" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "TransactionStatus" (
    "id" TEXT NOT NULL,
    "name" "TransactionStatusName" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionType" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdempotencyKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "account_external_id_debit" TEXT NOT NULL,
    "account_external_id_credit" TEXT NOT NULL,
    "transfer_type_id" INTEGER NOT NULL,
    "status_id" TEXT NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransactionStatus_name_key" ON "TransactionStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionType_name_key" ON "TransactionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyKey_key_key" ON "IdempotencyKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyKey_transactionId_key" ON "IdempotencyKey"("transactionId");

-- CreateIndex
CREATE INDEX "idx_idempotency_transaction" ON "IdempotencyKey"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_external_id_key" ON "Transaction"("external_id");

-- CreateIndex
CREATE INDEX "idx_transaction_status" ON "Transaction"("status_id");

-- CreateIndex
CREATE INDEX "idx_transaction_type" ON "Transaction"("transfer_type_id");

-- CreateIndex
CREATE INDEX "idx_transaction_created_at" ON "Transaction"("created_at");

-- AddForeignKey
ALTER TABLE "IdempotencyKey" ADD CONSTRAINT "IdempotencyKey_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transfer_type_id_fkey" FOREIGN KEY ("transfer_type_id") REFERENCES "TransactionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "TransactionStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

