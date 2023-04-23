-- CreateTable
CREATE TABLE "Transaction" (
    "transactionExternalId" TEXT NOT NULL,
    "transactionType" INTEGER NOT NULL DEFAULT 0,
    "value" DOUBLE PRECISION NOT NULL,
    "transactionStatus" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionExternalId")
);
