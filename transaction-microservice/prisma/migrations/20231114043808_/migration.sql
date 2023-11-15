/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_uuid_key" ON "Transaction"("uuid");
