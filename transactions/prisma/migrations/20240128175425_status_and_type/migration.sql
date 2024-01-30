/*
  Warnings:

  - You are about to drop the column `status` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `status`;

-- CreateTable
CREATE TABLE `TransactionStatus` (
    `TransactionStatusId` VARCHAR(191) NOT NULL,
    `from` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `To` DATETIME(3) NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `statusTransactionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`TransactionStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StatusTransaction` (
    `StatusTransactionId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`StatusTransactionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TransactionStatus` ADD CONSTRAINT `TransactionStatus_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`transactionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionStatus` ADD CONSTRAINT `TransactionStatus_statusTransactionId_fkey` FOREIGN KEY (`statusTransactionId`) REFERENCES `StatusTransaction`(`StatusTransactionId`) ON DELETE RESTRICT ON UPDATE CASCADE;
