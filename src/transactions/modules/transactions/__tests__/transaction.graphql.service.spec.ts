import { PrismaClient, TransactionStatusName, Prisma } from "@prisma/client";
import { Kafka } from "kafkajs";
import { Logger } from "pino";
import { TransactionGraphQLService } from "../transaction.graphql.service";
import { publishTransactionCreated } from "../transaction.publisher";
import { withPgTransactionLock } from "../../../locks/postgres-lock";
import type { KafkaTopics } from "../../../messaging/kafka.topics";

jest.mock("../transaction.publisher");
jest.mock("../../../locks/postgres-lock");
jest.mock("node:crypto", () => ({
  ...jest.requireActual("node:crypto"),
  randomUUID: jest.fn().mockReturnValue("mocked-uuid-123")
}));

describe("TransactionGraphQLService", () => {
  let mockPrisma: jest.Mocked<PrismaClient>;
  let mockKafka: jest.Mocked<Kafka>;
  let mockLogger: jest.Mocked<Logger>;
  let mockTopics: KafkaTopics;
  let service: TransactionGraphQLService;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPrisma = {
      transaction: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      },
      idempotencyKey: {
        findUnique: jest.fn()
      },
      $transaction: jest.fn()
    } as any;

    mockKafka = {} as any;

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: jest.fn().mockReturnThis()
    } as any;

    mockTopics = {
      transactionCreated: "transaction.created",
      transactionStatus: "transaction.status"
    };

    service = new TransactionGraphQLService({
      prisma: mockPrisma,
      kafka: mockKafka,
      topics: mockTopics,
      logger: mockLogger
    });
  });

  describe("transaction (Query)", () => {
    it("should return existing transaction", async () => {
      // Arrange
      const mockTransaction = {
        externalId: "txn-123",
        accountExternalIdDebit: "debit-111",
        accountExternalIdCredit: "credit-222",
        value: new Prisma.Decimal(250.00),
        createdAt: new Date("2024-01-15T12:00:00.000Z"),
        status: { id: 1, name: TransactionStatusName.pending },
        type: { id: 2, name: "TED" }
      };

      mockPrisma.transaction.findUnique = jest.fn().mockResolvedValue(mockTransaction);

      // Act
      const result = await service.transaction(null, { transactionExternalId: "txn-123" });

      // Assert
      expect(result).toEqual({
        transactionExternalId: "txn-123",
        transactionType: { name: "TED" },
        transactionStatus: { name: TransactionStatusName.pending },
        value: 250.00,
        createdAt: "2024-01-15T12:00:00.000Z"
      });
    });

    it("should return null when transaction does not exist", async () => {
      // Arrange
      mockPrisma.transaction.findUnique = jest.fn().mockResolvedValue(null);

      // Act
      const result = await service.transaction(null, { transactionExternalId: "non-existent" });

      // Assert
      expect(result).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe("createTransaction (Mutation)", () => {
    const mockInput = {
      accountExternalIdDebit: "debit-account-123",
      accountExternalIdCredit: "credit-account-456",
      transferTypeId: 1,
      value: 100.50
    };

    it("should create new transaction when idempotency key does not exist", async () => {
      // Arrange
      const mockTransactionRecord = {
        externalId: "mocked-uuid-123",
        accountExternalIdDebit: "debit-account-123",
        accountExternalIdCredit: "credit-account-456",
        value: new Prisma.Decimal(100.50),
        createdAt: new Date("2024-01-15T10:00:00.000Z"),
        status: { id: 1, name: TransactionStatusName.pending },
        type: { id: 1, name: "PIX" }
      };

      mockPrisma.idempotencyKey.findUnique = jest.fn().mockResolvedValue(null);
      (withPgTransactionLock as jest.Mock).mockImplementation(async (_, __, callback) => {
        return callback(mockPrisma);
      });
      mockPrisma.transaction.create = jest.fn().mockResolvedValue(mockTransactionRecord);

      // Act
      const result = await service.createTransaction(null, { input: mockInput });

      // Assert
      expect(result).toEqual({
        transactionExternalId: "mocked-uuid-123",
        transactionType: { name: "PIX" },
        transactionStatus: { name: TransactionStatusName.pending },
        value: 100.50,
        createdAt: "2024-01-15T10:00:00.000Z"
      });

      expect(publishTransactionCreated).toHaveBeenCalled();
    });

    it("should return existing transaction when idempotency key already exists", async () => {
      // Arrange
      const existingTransaction = {
        transaction: {
          externalId: "existing-uuid-999",
          accountExternalIdDebit: "debit-account-123",
          accountExternalIdCredit: "credit-account-456",
          value: new Prisma.Decimal(100.50),
          createdAt: new Date("2024-01-14T09:00:00.000Z"),
          status: { id: 2, name: TransactionStatusName.approved },
          type: { id: 1, name: "PIX" }
        }
      };

      mockPrisma.idempotencyKey.findUnique = jest.fn().mockResolvedValue(existingTransaction);

      // Act
      const result = await service.createTransaction(null, { input: mockInput });

      // Assert
      expect(result).toEqual({
        transactionExternalId: "existing-uuid-999",
        transactionType: { name: "PIX" },
        transactionStatus: { name: TransactionStatusName.approved },
        value: 100.50,
        createdAt: "2024-01-14T09:00:00.000Z"
      });

      expect(withPgTransactionLock).not.toHaveBeenCalled();
      expect(publishTransactionCreated).not.toHaveBeenCalled();
    });
  });
});
