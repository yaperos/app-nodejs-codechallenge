/*
  Warnings:

  - You are about to drop the column `tranferTypeId` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transactionExternalId` on the `Transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transaction_external_id]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_external_id` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_type` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Transactions_transactionExternalId_key";

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "tranferTypeId",
DROP COLUMN "transactionExternalId",
ADD COLUMN     "transaction_external_id" TEXT NOT NULL,
ADD COLUMN     "transaction_type" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_transaction_external_id_key" ON "Transactions"("transaction_external_id");
