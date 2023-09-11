-- CreateTable
CREATE TABLE "TransferType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TransferType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "transactionExternalId" TEXT NOT NULL,
    "accountExternalIdCredit" TEXT NOT NULL,
    "accountExternalIdDebit" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "transferTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionExternalId_key" ON "Transaction"("transactionExternalId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transferTypeId_fkey" FOREIGN KEY ("transferTypeId") REFERENCES "TransferType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
