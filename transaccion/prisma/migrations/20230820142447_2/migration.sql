-- CreateEnum
CREATE TYPE "TransaccionEstado" AS ENUM ('PENDIENTE', 'APROVADO', 'RECHAZADO');

-- AlterTable
ALTER TABLE "Transaccion" ADD COLUMN     "estado" "TransaccionEstado" NOT NULL DEFAULT 'PENDIENTE';
