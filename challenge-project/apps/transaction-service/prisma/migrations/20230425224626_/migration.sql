/*
  Warnings:

  - You are about to alter the column `value` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "value" SET DATA TYPE DECIMAL(10,2);
