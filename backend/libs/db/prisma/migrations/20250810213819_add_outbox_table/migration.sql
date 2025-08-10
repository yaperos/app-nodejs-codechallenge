-- CreateEnum
CREATE TYPE "public"."OutboxStatus" AS ENUM ('SENDING', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "public"."outbox" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "public"."OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_outbox_status_available" ON "public"."outbox"("status", "available_at");

-- CreateIndex
CREATE INDEX "transactions_created_at_idx" ON "public"."transactions"("created_at");

-- CreateIndex
CREATE INDEX "transactions_created_at_status_idx" ON "public"."transactions"("created_at", "status");
