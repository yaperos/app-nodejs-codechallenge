/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "tranferTypeId" DROP DEFAULT,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Transaction_tranferTypeId_seq";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "User";
