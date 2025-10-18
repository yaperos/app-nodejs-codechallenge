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

describe("TransactionService concurrency", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("creates only one record when two concurrent requests arrive", async () => {
    const logger = createLoggerMock();
    const created = buildTransaction({ externalId: "new-external-id" });

    const prisma = {
      idempotencyKey: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null)
          .mockResolvedValue({ transaction: created })
      },
      transaction: {
        findUnique: jest.fn(),
        create: jest.fn()
      }
    };

    const transactionalClientFirst = {
      idempotencyKey: {
        findUnique: jest.fn().mockResolvedValue(null)
      },
      transaction: {
        findUnique: jest.fn(),
        create: jest.fn().mockResolvedValue(created)
      }
    };

    const transactionalClientSecond = {
      idempotencyKey: {
        findUnique: jest.fn().mockResolvedValue({ transaction: created })
      },
      transaction: {
        findUnique: jest.fn(),
        create: jest.fn()
      }
    };

    const lock = jest
      .fn()
      .mockImplementationOnce(async (_prisma, _key, callback) => callback(transactionalClientFirst as any))
      .mockImplementationOnce(async (_prisma, _key, callback) => callback(transactionalClientSecond as any));

    const service = createTransactionService({
      prisma: prisma as unknown as PrismaClient,
      logger,
      lock
    });

    const body = {
      accountExternalIdDebit: created.accountExternalIdDebit,
      accountExternalIdCredit: created.accountExternalIdCredit,
      transferTypeId: created.transferTypeId,
      value: Number(created.value)
    };

    const headers = { "idempotency-key": "same-key" as const };

    const [first, second] = await Promise.all([
      service.create(body, headers),
      service.create(body, headers)
    ]);

    expect(transactionalClientFirst.transaction.create).toHaveBeenCalledTimes(1);
    expect(transactionalClientSecond.transaction.create).not.toHaveBeenCalled();
    expect(first.transactionExternalId).toEqual("new-external-id");
    expect(second.transactionExternalId).toEqual("new-external-id");
    expect(lock).toHaveBeenCalledTimes(2);
  });
});
