import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";
import { logger } from "../config/logger";

type GlobalPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as GlobalPrisma;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
  logger.debug({ module: "prisma" }, "prisma client initialized");
}
