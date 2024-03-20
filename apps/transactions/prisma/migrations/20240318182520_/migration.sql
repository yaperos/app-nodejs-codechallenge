/*
  Warnings:

  - The values [DEPOSIT] on the enum `TransactionTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionTypes_new" AS ENUM ('DEBIT', 'CREDIT', 'TRANSFER');
ALTER TABLE "TransactionType" ALTER COLUMN "type" TYPE "TransactionTypes_new" USING ("type"::text::"TransactionTypes_new");
ALTER TYPE "TransactionTypes" RENAME TO "TransactionTypes_old";
ALTER TYPE "TransactionTypes_new" RENAME TO "TransactionTypes";
DROP TYPE "TransactionTypes_old";
COMMIT;
