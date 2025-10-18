import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

type GlobalPrisma = {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as unknown as GlobalPrisma;

// Reuses a single PrismaClient instance across hot reloads during development
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
  logger.debug("Prisma client initialized");
}
