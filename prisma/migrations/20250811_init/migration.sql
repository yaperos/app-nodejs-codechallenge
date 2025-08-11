-- CreateTable
CREATE TABLE "Transaction" (
  "id" BIGSERIAL PRIMARY KEY,
  "transactionExternalId" TEXT NOT NULL,
  "accountExternalIdDebit" TEXT NOT NULL,
  "accountExternalIdCredit" TEXT NOT NULL,
  "transactionTypeId" INTEGER NOT NULL,
  "status" TEXT NOT NULL,
  "value" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionExternalId_key" ON "Transaction"("transactionExternalId");
