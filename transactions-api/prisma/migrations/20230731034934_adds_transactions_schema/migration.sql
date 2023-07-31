/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `accountExternalIdCredit` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountExternalIdDebit` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - The required column `transactionExternalId` was added to the `Transaction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `transferTypeId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "id",
ADD COLUMN     "accountExternalIdCredit" TEXT NOT NULL,
ADD COLUMN     "accountExternalIdDebit" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "transactionExternalId" TEXT NOT NULL,
ADD COLUMN     "transferStatus" "TransferStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "transferTypeId" INTEGER NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "value" INTEGER NOT NULL,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionExternalId");

-- CreateTable
CREATE TABLE "TransferType" (
    "transferTypeId" SERIAL NOT NULL,
    "transferTypeName" TEXT NOT NULL,

    CONSTRAINT "TransferType_pkey" PRIMARY KEY ("transferTypeId")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transferTypeId_fkey" FOREIGN KEY ("transferTypeId") REFERENCES "TransferType"("transferTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;
