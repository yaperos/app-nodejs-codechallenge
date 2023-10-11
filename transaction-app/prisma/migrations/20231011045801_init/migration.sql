-- CreateTable
CREATE TABLE "Transaction" (
    "transactionExternalId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "transactionType" TEXT NOT NULL,
    "transactionStatus" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionExternalId")
);
