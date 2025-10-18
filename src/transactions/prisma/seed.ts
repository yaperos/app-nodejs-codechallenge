import pino from "pino";
import { PrismaClient, TransactionStatusName } from "@prisma/client";

const logger = pino({ level: "info" });
const prisma = new PrismaClient();

// Bootstraps reference data so the application works right after migration
const seed = async () => {
  const statusSeeds = Object.values(TransactionStatusName);

  for (const status of statusSeeds) {
    await prisma.transactionStatus.upsert({
      where: { name: status },
      update: {},
      create: { name: status }
    });
  }

  const transferTypes = [
    { id: 1, name: "internal" },
    { id: 2, name: "external" }
  ];

  for (const type of transferTypes) {
    await prisma.transactionType.upsert({
      where: { id: type.id },
      update: { name: type.name },
      create: type
    });
  }

  logger.info("Seed data applied");
};

seed()
  .catch((error) => {
    logger.error({ err: error }, "Seed failed");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
