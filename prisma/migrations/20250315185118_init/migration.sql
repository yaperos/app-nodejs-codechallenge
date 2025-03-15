-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "accountExternalIdDebit" TEXT NOT NULL,
    "accountExternalIdCredit" TEXT NOT NULL,
    "tranferTypeId" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "statusId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TransactionStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "TransactionStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Inserta TransactionStatus por defecto
INSERT INTO "TransactionStatus" (id, name) VALUES (1, 'pending') ON CONFLICT (id) DO NOTHING;
INSERT INTO "TransactionStatus" (id, name) VALUES (2, 'approved') ON CONFLICT (id) DO NOTHING;
INSERT INTO "TransactionStatus" (id, name) VALUES (3, 'rejected') ON CONFLICT (id) DO NOTHING;