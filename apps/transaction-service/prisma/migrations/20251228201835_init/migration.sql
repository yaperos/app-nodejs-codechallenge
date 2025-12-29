-- CreateTable
CREATE TABLE "transaction_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "transaction_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_statuses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "transaction_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "accountExternalIdDebit" UUID NOT NULL,
    "accountExternalIdCredit" UUID NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "transactionTypeId" INTEGER NOT NULL,
    "transactionStatusId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_types_name_key" ON "transaction_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_statuses_name_key" ON "transaction_statuses"("name");

-- CreateIndex
CREATE INDEX "transactions_transactionStatusId_idx" ON "transactions"("transactionStatusId");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transactionTypeId_fkey" FOREIGN KEY ("transactionTypeId") REFERENCES "transaction_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transactionStatusId_fkey" FOREIGN KEY ("transactionStatusId") REFERENCES "transaction_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
