-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "accountExternalIdCredit" TEXT,
    "accountExternalIdDebit" TEXT,
    "status" TEXT NOT NULL,
    "tranferTypeId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
