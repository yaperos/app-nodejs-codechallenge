/*
  Warnings:

  - You are about to drop the column `UpdateAt` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "UpdateAt",
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
