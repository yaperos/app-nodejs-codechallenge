-- CreateTable
CREATE TABLE "MasterTable" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER,
    "value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MasterTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalTransaction" (
    "id" TEXT NOT NULL,
    "externalDebitAccountId" TEXT NOT NULL,
    "externalCreditAccountId" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "transferTypeId" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ExternalTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalDebitAccount" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "holderName" TEXT NOT NULL,
    "holderDocument" TEXT,
    "balance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ExternalDebitAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalCreditAccount" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "holderName" TEXT NOT NULL,
    "holderDocument" TEXT,
    "creditLimit" DOUBLE PRECISION NOT NULL,
    "debtBalance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ExternalCreditAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MasterTable_name_key" ON "MasterTable"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalDebitAccount_accountNumber_key" ON "ExternalDebitAccount"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalCreditAccount_accountNumber_key" ON "ExternalCreditAccount"("accountNumber");

-- AddForeignKey
ALTER TABLE "ExternalTransaction" ADD CONSTRAINT "ExternalTransaction_externalDebitAccountId_fkey" FOREIGN KEY ("externalDebitAccountId") REFERENCES "ExternalDebitAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalTransaction" ADD CONSTRAINT "ExternalTransaction_externalCreditAccountId_fkey" FOREIGN KEY ("externalCreditAccountId") REFERENCES "ExternalCreditAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalTransaction" ADD CONSTRAINT "ExternalTransaction_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "MasterTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalTransaction" ADD CONSTRAINT "ExternalTransaction_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "MasterTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalTransaction" ADD CONSTRAINT "ExternalTransaction_transferTypeId_fkey" FOREIGN KEY ("transferTypeId") REFERENCES "MasterTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- INITIAL DATA

-- MasterTable
INSERT INTO "MasterTable" ("parentId", "name", "description", "order", "createdAt") VALUES
    (null, 'Transaction Type', null, null, NOW()),
    (1, 'INCOMING', null, 1, NOW()),
    (1, 'OUTGOING', null, 2, NOW()),
    (1, 'PAYMENT', null, 3, NOW()),
    (1, 'CREDIT_PAYMENT', 4, null, NOW()),
    (null, 'Transaction Status', null, null, NOW()),
    (6, 'PENDING', null, 1, NOW()),
    (6, 'APPROVED', null, 2, NOW()),
    (6, 'REJECTED', null, 3, NOW()),
    (null, 'Transaction Transfer Type', null, null, NOW()),
    (10, 'INTERNAL', null, null, NOW()),
    (10, 'DOMESTIC', null, null, NOW()),
    (10, 'INTERNATIONAL', null, null, NOW());


-- ExternalDebitAccount
INSERT INTO "ExternalDebitAccount" ("id", "accountNumber", "bankName", "bankCode", "currency", "country", "holderName", "holderDocument", "balance", "createdAt") VALUES
    (gen_random_uuid(), '9876543210987654', 'BBVA', 'BBVAESMMXXX', 'EUR', 'Spain', 'Jane Smith', 'E87654321', 1200.50, NOW()),
    (gen_random_uuid(), '5678901234567890', 'Banco de Crédito del Perú', 'BCPLPEPL', 'PEN', 'Peru', 'Carlos Pérez', '46879012', 3500.00, NOW());

-- ExternalCreditAccount
INSERT INTO "ExternalCreditAccount" ("id", "accountNumber", "bankName", "bankCode", "currency", "country", "holderName", "holderDocument", "creditLimit", "debtBalance", "createdAt") VALUES
    (gen_random_uuid(), '5500000000000004', 'Santander', 'BSCHESMM', 'EUR', 'Spain', 'Jane Smith', 'E87654321', 3000.00, 500.75, NOW()),
    (gen_random_uuid(), '370000000000002', 'Banco de Crédito del Perú', 'BCPLPEPL', 'PEN', 'Peru', 'Carlos Pérez', '46879012', 7000.00, 2500.00, NOW());