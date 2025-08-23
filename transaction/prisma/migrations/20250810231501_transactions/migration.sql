-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "public"."transfer_types" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "transfer_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transactions" (
    "id" TEXT NOT NULL,
    "account_external_id_debit" VARCHAR(255) NOT NULL,
    "account_external_id_credit" VARCHAR(255) NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "transfer_type_id" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transfer_types_code_key" ON "public"."transfer_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "transfer_types_name_key" ON "public"."transfer_types"("name");

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_transfer_type_id_fkey" FOREIGN KEY ("transfer_type_id") REFERENCES "public"."transfer_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
