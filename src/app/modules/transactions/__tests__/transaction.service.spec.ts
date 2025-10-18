import type { PrismaClient } from "@prisma/client";
import { createTransactionService } from "../transaction.service.js";
import type { TransactionRecord } from "../transaction.types.js";

const createLoggerMock = () => {
  const logger: any = {
    child: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  };

  logger.child.mockReturnValue(logger);
  return logger;
};

const buildTransaction = (overrides: Partial<TransactionRecord> = {}): TransactionRecord => ({
  id: "transaction-id",
  externalId: "external-id",
  accountExternalIdDebit: "11111111-1111-1111-1111-111111111111",
  accountExternalIdCredit: "22222222-2222-2222-2222-222222222222",
  transferTypeId: 1,
  statusId: "status-id",
  value: 100 as any,
  createdAt: new Date("2023-01-01T00:00:00.000Z"),
  updatedAt: new Date("2023-01-01T00:00:00.000Z"),
  status: { id: "status-id", name: "pending", createdAt: new Date(), updatedAt: new Date() },
  type: { id: 1, name: "internal", createdAt: new Date(), updatedAt: new Date() },
  idempotencyKey: null,
  ...overrides
});

const createPrismaMock = () => ({
  idempotencyKey: {
    findUnique: jest.fn()
  },
  transaction: {
    findUnique: jest.fn(),
    create: jest.fn()
  }
});

describe("TransactionService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns existing transaction when idempotency key is reused", async () => {
    const logger = createLoggerMock();
    const prisma = createPrismaMock();
    const existing = buildTransaction();

    prisma.idempotencyKey.findUnique.mockResolvedValue({ transaction: existing });

    const service = createTransactionService({
      prisma: prisma as unknown as PrismaClient,
      logger,
      lock: jest.fn()
    });

    const result = await service.create(
      {
        accountExternalIdDebit: existing.accountExternalIdDebit,
        accountExternalIdCredit: existing.accountExternalIdCredit,
        transferTypeId: existing.transferTypeId,
        value: Number(existing.value)
      },
      { "idempotency-key": "dup-key" }
    );

    expect(result.transactionExternalId).toEqual(existing.externalId);
    expect(prisma.idempotencyKey.findUnique).toHaveBeenCalledTimes(1);
  });

  it("creates a transaction when idempotency key is new", async () => {
    const logger = createLoggerMock();
    const prisma = createPrismaMock();
    const created = buildTransaction({ externalId: "new-external-id" });

    prisma.idempotencyKey.findUnique.mockResolvedValueOnce(null);

    const transactionalClient = {
      idempotencyKey: {
        findUnique: jest.fn().mockResolvedValue(null)
      },
      transaction: {
        findUnique: jest.fn(),
        create: jest.fn().mockResolvedValue(created)
      }
    };

    const lock = jest.fn().mockImplementation(async (_prisma, _key, callback) => {
      return callback(transactionalClient as unknown as any);
    });

    const service = createTransactionService({
      prisma: prisma as unknown as PrismaClient,
      logger,
      lock
    });

    const result = await service.create(
      {
        accountExternalIdDebit: created.accountExternalIdDebit,
        accountExternalIdCredit: created.accountExternalIdCredit,
        transferTypeId: created.transferTypeId,
        value: Number(created.value)
      },
      { "idempotency-key": "fresh-key" }
    );

    expect(lock).toHaveBeenCalledTimes(1);
    expect(transactionalClient.transaction.create).toHaveBeenCalledTimes(1);
    expect(result.transactionExternalId).toEqual("new-external-id");
  });
});
