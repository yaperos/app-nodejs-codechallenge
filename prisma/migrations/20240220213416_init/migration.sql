-- CreateTable
CREATE TABLE "Transaccion" (
    "transaccion_id" SERIAL NOT NULL,
    "transactionExternalId" TEXT NOT NULL,
    "accountExternalIdDebit" TEXT NOT NULL,
    "accountExternalIdCredit" TEXT NOT NULL,
    "tranferTypeId" INTEGER NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "status" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("transaccion_id")
);
