/*
  Warnings:

  - Changed the type of `accountExternalIdDebit` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `accountExternalIdCredit` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "accountExternalIdDebit",
ADD COLUMN     "accountExternalIdDebit" UUID NOT NULL,
DROP COLUMN "accountExternalIdCredit",
ADD COLUMN     "accountExternalIdCredit" UUID NOT NULL;
