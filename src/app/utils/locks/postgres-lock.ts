import crypto from "node:crypto";
import { Prisma, PrismaClient } from "@prisma/client";
import type { Logger } from "pino";

const deriveLockKeys = (key: string): [number, number] => {
  const digest = crypto.createHash("sha256").update(key).digest();
  const first = digest.readInt32BE(0);
  const second = digest.readInt32BE(4);
  return [first, second];
};

export const withPgTransactionLock = async <T>(
  prisma: PrismaClient,
  key: string,
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
  logger?: Logger
): Promise<T> => {
  const [firstKey, secondKey] = deriveLockKeys(key);
  const scopedLogger = logger?.child({ lockKey: key });

  return prisma.$transaction(
    async (tx) => {
      scopedLogger?.debug("acquiring advisory lock");
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(${firstKey}, ${secondKey})`;
      scopedLogger?.debug("lock acquired");

      const result = await callback(tx);

      scopedLogger?.debug("releasing advisory lock");
      return result;
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
};
