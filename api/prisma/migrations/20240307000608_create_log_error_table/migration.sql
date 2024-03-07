-- CreateTable
CREATE TABLE "log_errors" (
    "id" SERIAL NOT NULL,
    "stack" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "log_errors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "log_errors_id_key" ON "log_errors"("id");
