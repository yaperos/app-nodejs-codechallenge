-- CreateTable
CREATE TABLE "transactions" (
    "id" VARCHAR(36) NOT NULL,
    "accountExternalIdDebit" VARCHAR(36) NOT NULL,
    "accountExternalIdCredit" VARCHAR(36) NOT NULL,
    "type" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_id_key" ON "transactions"("id");
