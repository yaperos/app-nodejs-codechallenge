-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "accountExternalIdDebit" TEXT,
    "accountExternalIdCredit" TEXT,
    "transferTypeId" INTEGER NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);
