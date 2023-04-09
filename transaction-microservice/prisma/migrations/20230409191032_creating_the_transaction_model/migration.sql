-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "account_type" "AccountType" NOT NULL,
    "transfer_type_id" INTEGER NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_uuid_key" ON "transaction"("uuid");
