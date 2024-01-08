-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."transactions" (
  "transactionExternalId" UUID DEFAULT gen_random_uuid() NOT NULL,
  "accountExternalIdDebit" TEXT NOT NULL,
  "accountExternalIdCredit" TEXT NOT NULL,
  "transactionStatusId" INTEGER,
  "transferTypeId" INTEGER NOT NULL,
  "value" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "modifiedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("transactionExternalId")
);
