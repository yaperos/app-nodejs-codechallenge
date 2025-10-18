import crypto from "node:crypto";
import { Prisma, PrismaClient } from "@prisma/client";
import type { Logger } from "pino";

const deriveLockKey = (key: string): bigint => {
  const digest = crypto.createHash("sha256").update(key).digest();
  // Converte os primeiros 8 bytes para bigint
  return digest.readBigInt64BE(0);
};

export const withPgTransactionLock = async <T>(
  prisma: PrismaClient,
  key: string,
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
  logger?: Logger
): Promise<T> => {
  const lockKey = deriveLockKey(key);
  const scopedLogger = logger?.child({ lockKey: key });

  return prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      scopedLogger?.debug("acquiring advisory lock");
      // Cast para void para evitar erro de deserialização
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey})`;
      scopedLogger?.debug("lock acquired");

      const result = await callback(tx);

      scopedLogger?.debug("releasing advisory lock");
      return result;
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
};
