-- CreateEnum
CREATE TYPE "TransactionStatusEnum" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AccountExternalNameEnum" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "TransferNameEnum" AS ENUM ('NATIONAL', 'INTERNATIONAL');

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "TransactionStatusEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_externals" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" "AccountExternalNameEnum" NOT NULL,

    CONSTRAINT "account_externals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" "TransferNameEnum" NOT NULL,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_uuid_key" ON "transactions"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "account_externals_uuid_key" ON "account_externals"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "transfers_uuid_key" ON "transfers"("uuid");
