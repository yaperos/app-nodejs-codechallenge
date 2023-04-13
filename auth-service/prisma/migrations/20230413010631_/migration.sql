CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
/*
  Warnings:

  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'INCOMPLETE');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
ADD COLUMN     "status" "userStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "id" SET DEFAULT uuid_generate_v4();
