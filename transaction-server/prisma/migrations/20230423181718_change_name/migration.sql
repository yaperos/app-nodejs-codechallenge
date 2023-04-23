/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Transaction";

-- CreateTable
CREATE TABLE "YapeTransaction" (
    "transactionExternalId" TEXT NOT NULL,
    "transactionType" INTEGER NOT NULL DEFAULT 0,
    "value" DOUBLE PRECISION NOT NULL,
    "transactionStatus" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YapeTransaction_pkey" PRIMARY KEY ("transactionExternalId")
);
