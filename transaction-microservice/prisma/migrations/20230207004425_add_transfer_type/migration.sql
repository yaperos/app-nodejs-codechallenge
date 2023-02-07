-- CreateTable
CREATE TABLE "TransferTypes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransferTypes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_transferTypeId_fkey" FOREIGN KEY ("transferTypeId") REFERENCES "TransferTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
