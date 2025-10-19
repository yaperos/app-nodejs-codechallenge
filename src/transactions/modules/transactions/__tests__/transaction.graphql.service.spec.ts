import { PrismaClient, TransactionStatusName, Prisma } from "@prisma/client";
import { Kafka } from "kafkajs";
import { Logger } from "pino";
import { GraphQLError } from "graphql";
import * as crypto from "node:crypto";
import { TransactionGraphQLService } from "../transaction.graphql.service";
import { publishTransactionCreated } from "../transaction.publisher";
import { withPgTransactionLock } from "../../../locks/postgres-lock";
import type { KafkaTopics } from "../../../messaging/kafka.topics";

jest.mock("../transaction.publisher");
jest.mock("../../../locks/postgres-lock");

const MOCK_TRANSACTION_ID = crypto.randomUUID();
const EXISTING_TRANSACTION_ID = crypto.randomUUID();
const DEBIT_ACCOUNT_ID = crypto.randomUUID();
const CREDIT_ACCOUNT_ID = crypto.randomUUID();
let randomUuidSpy: jest.SpiedFunction<typeof crypto.randomUUID>;

describe("TransactionGraphQLService", () => {
  let mockPrisma: jest.Mocked<PrismaClient>;
  let mockKafka: jest.Mocked<Kafka>;
  let mockLogger: jest.Mocked<Logger>;
  let mockTopics: KafkaTopics;
  let service: TransactionGraphQLService;

  beforeEach(() => {
    randomUuidSpy = jest.spyOn(crypto, "randomUUID").mockReturnValue(MOCK_TRANSACTION_ID);
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

  afterEach(() => {
    randomUuidSpy.mockRestore();
  });

  describe("transaction (Query)", () => {
    it("should reject invalid UUID", async () => {
      await expect(service.transaction(null, { transactionExternalId: "invalid" }))
        .rejects.toThrow(GraphQLError);
    });

    it("should return existing transaction", async () => {
      // Arrange
      const mockTransaction = {
        externalId: MOCK_TRANSACTION_ID,
        accountExternalIdDebit: DEBIT_ACCOUNT_ID,
        accountExternalIdCredit: CREDIT_ACCOUNT_ID,
        value: new Prisma.Decimal(250.00),
        createdAt: new Date("2024-01-15T12:00:00.000Z"),
        status: { id: 1, name: TransactionStatusName.pending },
        type: { id: 2, name: "TED" }
      };

      mockPrisma.transaction.findUnique = jest.fn().mockResolvedValue(mockTransaction);

      // Act
      const result = await service.transaction(null, { transactionExternalId: MOCK_TRANSACTION_ID });

      // Assert
      expect(result).toEqual({
        transactionExternalId: MOCK_TRANSACTION_ID,
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
      const result = await service.transaction(null, { transactionExternalId: EXISTING_TRANSACTION_ID });

      // Assert
      expect(result).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe("createTransaction (Mutation)", () => {
    const mockInput = {
      accountExternalIdDebit: DEBIT_ACCOUNT_ID,
      accountExternalIdCredit: CREDIT_ACCOUNT_ID,
      transferTypeId: 1,
      value: 100.50
    };

    it("should create new transaction when idempotency key does not exist", async () => {
      // Arrange
      const mockTransactionRecord = {
        externalId: MOCK_TRANSACTION_ID,
        accountExternalIdDebit: DEBIT_ACCOUNT_ID,
        accountExternalIdCredit: CREDIT_ACCOUNT_ID,
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
        transactionExternalId: MOCK_TRANSACTION_ID,
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
          externalId: EXISTING_TRANSACTION_ID,
          accountExternalIdDebit: DEBIT_ACCOUNT_ID,
          accountExternalIdCredit: CREDIT_ACCOUNT_ID,
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
        transactionExternalId: EXISTING_TRANSACTION_ID,
        transactionType: { name: "PIX" },
        transactionStatus: { name: TransactionStatusName.approved },
        value: 100.50,
        createdAt: "2024-01-14T09:00:00.000Z"
      });

      expect(withPgTransactionLock).not.toHaveBeenCalled();
      expect(publishTransactionCreated).not.toHaveBeenCalled();
    });

    it("should reject payloads with invalid UUIDs", async () => {
      await expect(
        service.createTransaction(null, {
          input: {
            accountExternalIdDebit: "not-a-uuid",
            accountExternalIdCredit: mockInput.accountExternalIdCredit,
            transferTypeId: mockInput.transferTypeId,
            value: mockInput.value
          }
        })
      ).rejects.toThrow(GraphQLError);
    });

    it("should reject payloads with invalid numeric fields", async () => {
      await expect(
        service.createTransaction(null, {
          input: {
            accountExternalIdDebit: mockInput.accountExternalIdDebit,
            accountExternalIdCredit: mockInput.accountExternalIdCredit,
            transferTypeId: 0,
            value: -10
          }
        })
      ).rejects.toThrow(GraphQLError);
    });
  });
});
