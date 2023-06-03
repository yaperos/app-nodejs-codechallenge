-- CreateTable
CREATE TABLE "Transaction" (
    "transactionExternalId" VARCHAR(64) NOT NULL,
    "accountExternalIdDebit" VARCHAR(64) NOT NULL,
    "accountExternalIdCredit" VARCHAR(64) NOT NULL,
    "transferTypeId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "status" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionExternalId")
);
