-- CreateTable
CREATE TABLE "Transaction" (
    "accountExternalIdCredit" TEXT NOT NULL,
    "accountExternalIdDebit" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("accountExternalIdCredit")
);
