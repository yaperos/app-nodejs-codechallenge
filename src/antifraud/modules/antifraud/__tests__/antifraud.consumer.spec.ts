import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import { Logger } from "pino";
import { startAntifraudConsumer } from "../antifraud.consumer";
import { createKafkaConsumer } from "../../../messaging/kafka.consumer";
import { sendKafkaMessage } from "../../../messaging/kafka.producer";
import { evaluateTransaction } from "../antifraud.processor";
import { TransactionCreatedEvent } from "../../../messaging/events";
import { Env } from "../../../config/env";
import * as crypto from "node:crypto";

jest.mock("../../../messaging/kafka.consumer");
jest.mock("../../../messaging/kafka.producer");
jest.mock("../antifraud.processor");

const TRANSACTION_ID_APPROVED = crypto.randomUUID();
const TRANSACTION_ID_REJECTED = crypto.randomUUID();
const DEBIT_ACCOUNT_ID = crypto.randomUUID();
const CREDIT_ACCOUNT_ID = crypto.randomUUID();
const HIGH_VALUE_DEBIT_ID = crypto.randomUUID();
const HIGH_VALUE_CREDIT_ID = crypto.randomUUID();

describe("AntifraudConsumer", () => {
  let mockKafka: jest.Mocked<Kafka>;
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

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      child: jest.fn().mockReturnThis()
    } as any;

    mockEnv = {
      KAFKA_CONSUMER_GROUP_ANTIFRAUD: "antifraud-group",
      KAFKA_TRANSACTION_TOPIC: "transaction.created",
      KAFKA_STATUS_TOPIC: "transaction.status",
      KAFKA_BROKERS: "localhost:9092",
      KAFKA_CLIENT_ID: "antifraud-test",
      NODE_ENV: "test"
    } as any;

    (createKafkaConsumer as jest.Mock).mockResolvedValue(mockConsumer);
  });

  describe("startAntifraudConsumer", () => {
    it("should create consumer with correct configuration", async () => {
      // Act
      await startAntifraudConsumer({
        kafka: mockKafka,
        env: mockEnv,
        logger: mockLogger
      });

      // Assert
      expect(createKafkaConsumer).toHaveBeenCalledWith(
        mockKafka,
        expect.objectContaining({
          groupId: "antifraud-group",
          topics: ["transaction.created"],
          logger: mockLogger,
          handler: expect.any(Function)
        })
      );
    });

    it("should return the created consumer", async () => {
      // Act
      const result = await startAntifraudConsumer({
        kafka: mockKafka,
        env: mockEnv,
        logger: mockLogger
      });

      // Assert
      expect(result).toBe(mockConsumer);
    });
  });

  describe("message handler", () => {
    let handler: (payload: EachMessagePayload) => Promise<void>;

    beforeEach(async () => {
      await startAntifraudConsumer({
        kafka: mockKafka,
        env: mockEnv,
        logger: mockLogger
      });

      const callArgs = (createKafkaConsumer as jest.Mock).mock.calls[0][1];
      handler = callArgs.handler;
    });

    it("should process valid message and send result", async () => {
      // Arrange
      const transactionEvent: TransactionCreatedEvent = {
        transactionExternalId: TRANSACTION_ID_APPROVED,
        accountExternalIdDebit: DEBIT_ACCOUNT_ID,
        accountExternalIdCredit: CREDIT_ACCOUNT_ID,
        transferTypeId: 1,
        value: 150.00,
        createdAt: new Date("2024-01-15T10:00:00Z").toISOString()
      };

      const message = {
        value: Buffer.from(JSON.stringify(transactionEvent))
      };

      const statusEvent = {
        transactionExternalId: TRANSACTION_ID_APPROVED,
        status: "approved",
        processedAt: "2024-01-15T10:00:00Z"
      };

      (evaluateTransaction as jest.Mock).mockReturnValue(statusEvent);

      // Act
      await handler({ message } as any);

      // Assert
      expect(evaluateTransaction).toHaveBeenCalledWith(transactionEvent);
      expect(sendKafkaMessage).toHaveBeenCalledWith(
        mockKafka,
        {
          topic: "transaction.status",
          messages: [{
            key: TRANSACTION_ID_APPROVED,
            value: JSON.stringify(statusEvent)
          }]
        },
        mockLogger
      );
    });

    it("should log warning when receiving empty message", async () => {
      // Arrange
      const message = { value: null };

      // Act
      await handler({ message } as any);

      // Assert
      expect(mockLogger.warn).toHaveBeenCalledWith("received empty kafka message");
      expect(evaluateTransaction).not.toHaveBeenCalled();
      expect(sendKafkaMessage).not.toHaveBeenCalled();
    });

    it("should process rejected transaction correctly", async () => {
      // Arrange
      const transactionEvent: TransactionCreatedEvent = {
        transactionExternalId: TRANSACTION_ID_REJECTED,
        accountExternalIdDebit: HIGH_VALUE_DEBIT_ID,
        accountExternalIdCredit: HIGH_VALUE_CREDIT_ID,
        transferTypeId: 2,
        value: 10000.00,
        createdAt: new Date("2024-01-15T11:00:00Z").toISOString()
      };

      const message = {
        value: Buffer.from(JSON.stringify(transactionEvent))
      };

      const statusEvent = {
        transactionExternalId: TRANSACTION_ID_REJECTED,
        status: "rejected",
        processedAt: "2024-01-15T11:00:00Z"
      };

      (evaluateTransaction as jest.Mock).mockReturnValue(statusEvent);

      // Act
      await handler({ message } as any);

      // Assert
      expect(sendKafkaMessage).toHaveBeenCalledWith(
        mockKafka,
        {
          topic: "transaction.status",
          messages: [{
            key: TRANSACTION_ID_REJECTED,
            value: JSON.stringify(statusEvent)
          }]
        },
        mockLogger
      );
    });
  });
});
