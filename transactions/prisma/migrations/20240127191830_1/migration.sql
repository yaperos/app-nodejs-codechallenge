-- CreateTable
CREATE TABLE `users` (
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `transactionId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NULL,
    `account_id_debit` VARCHAR(191) NOT NULL,
    `account_id_credit` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `status` VARCHAR(191) NULL,
    `snapshotId` VARCHAR(191) NULL,

    PRIMARY KEY (`transactionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `balances` (
    `balanceId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `balances_userId_key`(`userId`),
    PRIMARY KEY (`balanceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BalanceSnapshot` (
    `snapshotID` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `from` DATETIME(3) NOT NULL,
    `to` DATETIME(3) NULL,
    `balanceID` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `snapshotAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0,

    PRIMARY KEY (`snapshotID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_account_id_debit_fkey` FOREIGN KEY (`account_id_debit`) REFERENCES `balances`(`balanceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_account_id_credit_fkey` FOREIGN KEY (`account_id_credit`) REFERENCES `balances`(`balanceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_snapshotId_fkey` FOREIGN KEY (`snapshotId`) REFERENCES `BalanceSnapshot`(`snapshotID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `balances` ADD CONSTRAINT `balances_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceSnapshot` ADD CONSTRAINT `BalanceSnapshot_balanceID_fkey` FOREIGN KEY (`balanceID`) REFERENCES `balances`(`balanceId`) ON DELETE RESTRICT ON UPDATE CASCADE;
