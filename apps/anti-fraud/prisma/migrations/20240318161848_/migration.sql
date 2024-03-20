-- CreateEnum
CREATE TYPE "AntiFraudStatus" AS ENUM ('APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "AntiFraud" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "status" "AntiFraudStatus" NOT NULL,

    CONSTRAINT "AntiFraud_pkey" PRIMARY KEY ("id")
);
