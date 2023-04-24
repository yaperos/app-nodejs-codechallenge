/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionExternalId` on the `Transaction` table. All the data in the column will be lost.
  - The required column `externalId` was added to the `Transaction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Transaction_transactionExternalId_key";

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "id",
DROP COLUMN "transactionExternalId",
ADD COLUMN     "externalId" TEXT NOT NULL,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("externalId");
