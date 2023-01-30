-- CreateTable
CREATE TABLE "transaction_status_list" (
    "idStatus" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "transaction_status_list_pkey" PRIMARY KEY ("idStatus")
);

-- CreateTable
CREATE TABLE "transaction_type_list" (
    "idType" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "transaction_type_list_pkey" PRIMARY KEY ("idType")
);

-- CreateTable
CREATE TABLE "transactions" (
    "accountExternalIdDebit" TEXT NOT NULL DEFAULT '',
    "accountExternalIdCredit" TEXT NOT NULL DEFAULT '',
    "transferTypeId" INTEGER NOT NULL DEFAULT 1,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(5) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(5) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionExternalId" TEXT NOT NULL,
    "transactionStatusId" INTEGER NOT NULL DEFAULT 1,
    "transactionTypeId" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transactionExternalId")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transactionStatusId_fkey" FOREIGN KEY ("transactionStatusId") REFERENCES "transaction_status_list"("idStatus") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transactionTypeId_fkey" FOREIGN KEY ("transactionTypeId") REFERENCES "transaction_type_list"("idType") ON DELETE RESTRICT ON UPDATE CASCADE;
