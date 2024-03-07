-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "transactions" (
    "id" BIGSERIAL NOT NULL,
    "accountExternalIdDebit" TEXT NOT NULL,
    "accountExternalIdCredit" TEXT NOT NULL,
    "transactionExternalId" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "value" DECIMAL(65,30) NOT NULL,
    "transferTypeId" INTEGER NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer_types" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "transfer_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_id_key" ON "transactions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transactionExternalId_key" ON "transactions"("transactionExternalId");

-- CreateIndex
CREATE UNIQUE INDEX "transfer_types_id_key" ON "transfer_types"("id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transferTypeId_fkey" FOREIGN KEY ("transferTypeId") REFERENCES "transfer_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
