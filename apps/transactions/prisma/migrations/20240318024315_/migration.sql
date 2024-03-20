/*
  Warnings:

  - Added the required column `account_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "account_id" TEXT NOT NULL;
