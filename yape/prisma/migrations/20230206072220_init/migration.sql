-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "transactionExternalId" VARCHAR NOT NULL,
    "accountExternalIdDebit" VARCHAR NOT NULL,
    "accountExternalIdCredit" VARCHAR NOT NULL,
    "type" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions_logs" (
    "id" SERIAL NOT NULL,
    "data" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transactionExternalId_key" ON "transactions"("transactionExternalId");
