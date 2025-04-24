-- CreateTable
CREATE TABLE "transactions" (
    "external_id" TEXT NOT NULL,
    "type_name" TEXT NOT NULL,
    "status_name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("external_id")
);
