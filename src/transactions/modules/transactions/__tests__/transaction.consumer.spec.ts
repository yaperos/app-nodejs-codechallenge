import { PrismaClient, TransactionStatusName } from "@prisma/client";
import type { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import type { Logger } from "pino";
import { startTransactionStatusConsumer } from "../transaction.consumer";
import { createKafkaConsumer } from "../../../messaging/kafka.consumer";
import type { TransactionStatusEvent } from "../../../messaging/events";
import type { Env } from "../../../config/env";

jest.mock("../../../messaging/kafka.consumer");

describe("TransactionConsumer", () => {
  let mockKafka: jest.Mocked<Kafka>;
  let mockPrisma: jest.Mocked<PrismaClient>;
  let mockLogger: jest.Mocked<Logger>;
  let mockEnv: Env;
  let mockConsumer: jest.Mocked<Consumer>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockConsumer = {
      connect: jest.fn(),
      subscribe: jest.fn(),
      run: jest.fn(),
      disconnect: jest.fn()
    } as any;

    mockKafka = {} as any;

    mockPrisma = {
      transaction: {
        update: jest.fn().mockResolvedValue({})
      }
    } as any;

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      child: jest.fn().mockReturnThis()
    } as any;

    mockEnv = {
      KAFKA_CONSUMER_GROUP_TRANSACTIONS: "transactions-group",
      KAFKA_STATUS_TOPIC: "transaction.status",
      KAFKA_TRANSACTION_TOPIC: "transaction.created",
      KAFKA_BROKERS: "localhost:9092",
      NODE_ENV: "test"
    } as any;

    (createKafkaConsumer as jest.Mock).mockResolvedValue(mockConsumer);
  });

  describe("startTransactionStatusConsumer", () => {
    it("should create consumer with correct configuration", async () => {
      // Act
      await startTransactionStatusConsumer({
        kafka: mockKafka,
        env: mockEnv,
        prisma: mockPrisma,
        logger: mockLogger
      });

      // Assert
      expect(createKafkaConsumer).toHaveBeenCalledWith(
        mockKafka,
        expect.objectContaining({
          groupId: "transactions-group",
          topics: ["transaction.status"],
          logger: mockLogger,
          handler: expect.any(Function)
        })
      );
    });


    it("should return the created consumer", async () => {
      // Act
      const result = await startTransactionStatusConsumer({
        kafka: mockKafka,
        env: mockEnv,
        prisma: mockPrisma,
        logger: mockLogger
      });

      // Assert
      expect(result).toBe(mockConsumer);
    });
  });

  describe("message handler", () => {
    let handler: (payload: EachMessagePayload) => Promise<void>;

    beforeEach(async () => {
      await startTransactionStatusConsumer({
        kafka: mockKafka,
        env: mockEnv,
        prisma: mockPrisma,
        logger: mockLogger
      });

      const callArgs = (createKafkaConsumer as jest.Mock).mock.calls[0][1];
      handler = callArgs.handler;
    });

    it("should process approved status message", async () => {
      // Arrange
      const statusEvent: TransactionStatusEvent = {
        transactionExternalId: "txn-approved-123",
        status: "approved",
        processedAt: "2024-01-15T10:00:00Z"
      };

      const message = {
        value: Buffer.from(JSON.stringify(statusEvent))
      };

      // Act
      await handler({ message } as any);

      // Assert
      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { externalId: "txn-approved-123" },
        data: {
          status: {
            connect: { name: TransactionStatusName.approved }
          }
        }
      });
      expect(mockLogger.info).toHaveBeenCalledWith(
        {
          transactionExternalId: "txn-approved-123",
          status: TransactionStatusName.approved
        },
        "transaction status updated"
      );
    });

    it("should process rejected status message", async () => {
      // Arrange
      const statusEvent: TransactionStatusEvent = {
        transactionExternalId: "txn-rejected-456",
        status: "rejected",
        processedAt: "2024-01-15T11:00:00Z"
      };

      const message = {
        value: Buffer.from(JSON.stringify(statusEvent))
      };

      // Act
      await handler({ message } as any);

      // Assert
      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { externalId: "txn-rejected-456" },
        data: {
          status: {
            connect: { name: TransactionStatusName.rejected }
          }
        }
      });
      expect(mockLogger.info).toHaveBeenCalledWith(
        {
          transactionExternalId: "txn-rejected-456",
          status: TransactionStatusName.rejected
        },
        "transaction status updated"
      );
    });

    it("should log warning when receiving empty message", async () => {
      // Arrange
      const message = { value: null };

      // Act
      await handler({ message } as any);

      // Assert
      expect(mockLogger.warn).toHaveBeenCalledWith("received empty status message");
      expect(mockPrisma.transaction.update).not.toHaveBeenCalled();
    });
  });
});