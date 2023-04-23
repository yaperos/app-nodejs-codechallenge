/*
  Warnings:

  - Added the required column `accountExternalIdCredit` to the `YapeTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountExternalIdDebit` to the `YapeTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "YapeTransaction" ADD COLUMN     "accountExternalIdCredit" TEXT NOT NULL,
ADD COLUMN     "accountExternalIdDebit" TEXT NOT NULL;
