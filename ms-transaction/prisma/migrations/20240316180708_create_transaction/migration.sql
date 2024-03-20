-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransferType" AS ENUM ('DEBIT', 'CREDIT', 'CASH');

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "externalId" VARCHAR(256) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "accountExternalName" TEXT NOT NULL,
    "transferTypeName" "TransferType" NOT NULL,
    "status" "TransferStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_externalId_key" ON "transactions"("externalId");

-- CreateIndex
CREATE INDEX "transactions_externalId_idx" ON "transactions"("externalId");
