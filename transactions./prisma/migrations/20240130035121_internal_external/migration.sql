-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_account_id_credit_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_account_id_debit_fkey`;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `external_account_id_credit` VARCHAR(191) NULL,
    ADD COLUMN `external_account_id_debit` VARCHAR(191) NULL,
    MODIFY `account_id_debit` VARCHAR(191) NULL,
    MODIFY `account_id_credit` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_account_id_debit_fkey` FOREIGN KEY (`account_id_debit`) REFERENCES `balances`(`balanceId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_account_id_credit_fkey` FOREIGN KEY (`account_id_credit`) REFERENCES `balances`(`balanceId`) ON DELETE SET NULL ON UPDATE CASCADE;
