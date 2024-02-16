-- CreateTable
CREATE TABLE "transaction_status" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "transaction_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "transaction_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "transactionExternalId" TEXT NOT NULL,
    "accountExternalIdDebit" TEXT NOT NULL,
    "accountExternalIdCredit" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "transactionStatusId" TEXT NOT NULL,
    "transactionTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("transactionExternalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "transaction_status_name_key" ON "transaction_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_type_name_key" ON "transaction_type"("name");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_transactionStatusId_fkey" FOREIGN KEY ("transactionStatusId") REFERENCES "transaction_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_transactionTypeId_fkey" FOREIGN KEY ("transactionTypeId") REFERENCES "transaction_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
