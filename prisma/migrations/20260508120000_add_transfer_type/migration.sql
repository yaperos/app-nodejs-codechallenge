-- CreateTable
CREATE TABLE "TransferType" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TransferType_pkey" PRIMARY KEY ("id")
);

-- Seed default transfer type used by the challenge example (tranferTypeId: 1)
INSERT INTO "TransferType" ("id", "name") VALUES (1, 'Cuenta a cuenta');

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transferTypeId_fkey" FOREIGN KEY ("transferTypeId") REFERENCES "TransferType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
