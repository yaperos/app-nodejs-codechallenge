-- CreateTable
CREATE TABLE "Transaccion" (
    "id" SERIAL NOT NULL,
    "accountExternalIdDebit" TEXT NOT NULL,
    "accountExternalIdCredit" TEXT,
    "tranferTypeId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("id")
);
