import { PrismaClient, TransactionStatusName } from "@prisma/client";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { KafkaContainer, type StartedKafkaContainer } from "@testcontainers/kafka";
import { Kafka, Producer, Consumer, Admin, logLevel } from "kafkajs";
import { execSync } from "child_process";
import { TransactionGraphQLService } from "../transaction.graphql.service";
import { startTransactionStatusConsumer } from "../transaction.consumer";
import type { TransactionStatusEvent } from "../../../messaging/events";
import type { Env } from "../../../config/env";
import type { KafkaTopics } from "../../../messaging/kafka.topics";
import pino from "pino";
import { randomUUID } from "node:crypto";

describe("Transactions Integration Tests", () => {
  let postgresContainer: StartedPostgreSqlContainer;
  let kafkaContainer: StartedKafkaContainer;
  let prisma: PrismaClient;
  let kafka: Kafka;
  let producer: Producer;
  let consumer: Consumer;
  let admin: Admin;
  let statusConsumer: Consumer;
  let env: Env;
  let topics: KafkaTopics;

  beforeAll(async () => {
    // Initialize PostgreSQL container
    postgresContainer = await new PostgreSqlContainer()
      .withDatabase("transactions_test")
      .withUsername("test_user")
      .withPassword("test_password")
      .start();

    const databaseUrl = postgresContainer.getConnectionUri();
    process.env.DATABASE_URL = databaseUrl;

    // Initialize Prisma and run migrations
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      }
    });

    // Run Prisma migrations
    execSync("pnpm prisma migrate deploy", {
      env: { ...process.env, DATABASE_URL: databaseUrl },
      cwd: "/Users/flaviosantos/Desktop/test/app-nodejs-codechallenge/src/transactions"
    });

    // Seed database with initial data
    await prisma.transactionStatus.createMany({
      data: [
        { name: TransactionStatusName.pending },
        { name: TransactionStatusName.approved },
        { name: TransactionStatusName.rejected }
      ],
      skipDuplicates: true
    });

    await prisma.transactionType.createMany({
      data: [
        { id: 1, name: "internal" },
        { id: 2, name: "external" }
      ],
      skipDuplicates: true
    });

    // Initialize Kafka container
    kafkaContainer = await new KafkaContainer()
      .withExposedPorts(9093)
      .start();

    const brokers = `${kafkaContainer.getHost()}:${kafkaContainer.getMappedPort(9093)}`;

    topics = {
      transactionCreated: "test.transaction.created",
      transactionStatus: "test.transaction.status"
    };

    env = {
      KAFKA_BROKERS: brokers,
      KAFKA_CONSUMER_GROUP_TRANSACTIONS: "transactions-test-group",
      KAFKA_TRANSACTION_TOPIC: topics.transactionCreated,
      KAFKA_STATUS_TOPIC: topics.transactionStatus,
      NODE_ENV: "test",
      PORT: 3000
    } as Env;

    kafka = new Kafka({
      brokers: [brokers],
      logLevel: logLevel.NOTHING
    });

    admin = kafka.admin();
    await admin.connect();

    // Create topics
    await admin.createTopics({
      topics: [
        { topic: topics.transactionCreated, numPartitions: 1 },
        { topic: topics.transactionStatus, numPartitions: 1 }
      ]
    });

    // Wait for topics to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    producer = kafka.producer();
    await producer.connect();

    consumer = kafka.consumer({ groupId: "test-consumer-group" });
    await consumer.connect();
  }, 90000);

  afterAll(async () => {
    if (statusConsumer) {
      await statusConsumer.stop();
      await statusConsumer.disconnect();
    }
    if (consumer) {
      await consumer.stop();
      await consumer.disconnect();
    }
    if (producer) await producer.disconnect();
    if (admin) await admin.disconnect();
    await prisma.$disconnect();
    if (kafkaContainer) await kafkaContainer.stop();
    if (postgresContainer) await postgresContainer.stop();
  }, 30000);

  describe("TransactionGraphQLService", () => {
    it("should create transaction and ensure idempotency", async () => {
      // Arrange
      const logger = pino({ level: "silent" });
      const service = new TransactionGraphQLService({
        prisma,
        kafka,
        topics,
        logger
      });

      const input = {
        accountExternalIdDebit: randomUUID(),
        accountExternalIdCredit: randomUUID(),
        transferTypeId: 1,
        value: 150.00
      };

      // Act - First request
      const result1 = await service.createTransaction(null, { input });

      // Act - Second request with same data (same idempotency key)
      const result2 = await service.createTransaction(null, { input });

      // Assert
      expect(result1.transactionExternalId).toBe(result2.transactionExternalId);
      expect(result1.value).toBe(150.00);
      expect(result1.transactionStatus.name).toBe(TransactionStatusName.pending);
      expect(result1.transactionType.name).toBe("internal");

      // Verify only one transaction was created
      const count = await prisma.transaction.count({
        where: {
          accountExternalIdDebit: input.accountExternalIdDebit,
          accountExternalIdCredit: input.accountExternalIdCredit
        }
      });
      expect(count).toBe(1);
    });

    it("should query transaction by external id", async () => {
      // Arrange
      const logger = pino({ level: "silent" });
      const service = new TransactionGraphQLService({
        prisma,
        kafka,
        topics,
        logger
      });

      const input = {
        accountExternalIdDebit: randomUUID(),
        accountExternalIdCredit: randomUUID(),
        transferTypeId: 2,
        value: 500.00
      };

      // Act - Create transaction
      const created = await service.createTransaction(null, { input });

      // Act - Query transaction
      const queried = await service.transaction(null, {
        transactionExternalId: created.transactionExternalId
      });

      // Assert
      expect(queried).not.toBeNull();
      expect(queried?.transactionExternalId).toBe(created.transactionExternalId);
      expect(queried?.value).toBe(500.00);
      expect(queried?.transactionType.name).toBe("external");
    });

    it("should return null for non-existent transaction", async () => {
      // Arrange
      const logger = pino({ level: "silent" });
      const service = new TransactionGraphQLService({
        prisma,
        kafka,
        topics,
        logger
      });

      // Act
      const result = await service.transaction(null, {
        transactionExternalId: randomUUID()
      });

      // Assert
      expect(result).toBeNull();
    });

    it("should list all transactions", async () => {
      // Arrange
      const logger = pino({ level: "silent" });
      const service = new TransactionGraphQLService({
        prisma,
        kafka,
        topics,
        logger
      });

      // Act
      const transactions = await service.transactions(null, {});

      // Assert
      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions.length).toBeGreaterThan(0);
    });
  });

  describe("Kafka Integration", () => {
    it("should process status event via Kafka", async () => {
      // Arrange
      const logger = pino({ level: "silent" });
      const service = new TransactionGraphQLService({
        prisma,
        kafka,
        topics,
        logger
      });

      // Create transaction
      const input = {
        accountExternalIdDebit: randomUUID(),
        accountExternalIdCredit: randomUUID(),
        transferTypeId: 1,
        value: 250.00
      };

      const created = await service.createTransaction(null, { input });

      // Start status consumer
      statusConsumer = await startTransactionStatusConsumer({
        kafka,
        env,
        prisma,
        logger
      });

      // Wait for consumer to be ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      const statusEvent: TransactionStatusEvent = {
        transactionExternalId: created.transactionExternalId,
        status: "approved",
        processedAt: new Date().toISOString()
      };

      // Act - Send status event via Kafka
      await producer.send({
        topic: topics.transactionStatus,
        messages: [{
          key: statusEvent.transactionExternalId,
          value: JSON.stringify(statusEvent)
        }]
      });

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Assert - Verify status was updated
      const updated = await prisma.transaction.findUnique({
        where: { externalId: created.transactionExternalId },
        include: { status: true }
      });

      expect(updated?.status.name).toBe(TransactionStatusName.approved);
    }, 20000);

    it("should publish transaction created event", async () => {
      // Arrange
      const logger = pino({ level: "silent" });
      const service = new TransactionGraphQLService({
        prisma,
        kafka,
        topics,
        logger
      });

      // Create a new consumer for this test to avoid conflicts
      const testConsumer = kafka.consumer({ groupId: "test-events-consumer" });
      await testConsumer.connect();
      await testConsumer.subscribe({
        topic: topics.transactionCreated,
        fromBeginning: false
      });

      const receivedEvents: any[] = [];
      let resolvePromise: () => void;
      const eventPromise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      await testConsumer.run({
        eachMessage: async ({ message }) => {
          if (message.value) {
            const event = JSON.parse(message.value.toString());
            receivedEvents.push(event);
            resolvePromise();
          }
        }
      });

      // Wait for consumer to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Act - Create transaction (which publishes event)
      const input = {
        accountExternalIdDebit: randomUUID(),
        accountExternalIdCredit: randomUUID(),
        transferTypeId: 1,
        value: 350.00
      };

      const created = await service.createTransaction(null, { input });

      // Assert
      await Promise.race([
        eventPromise,
        new Promise(resolve => setTimeout(resolve, 8000))
      ]);

      await testConsumer.stop();
      await testConsumer.disconnect();

      expect(receivedEvents.length).toBeGreaterThan(0);
      expect(receivedEvents[0]).toMatchObject({
        transactionExternalId: created.transactionExternalId,
        accountExternalIdDebit: input.accountExternalIdDebit,
        accountExternalIdCredit: input.accountExternalIdCredit,
        value: input.value
      });
    }, 15000);
  });

  describe("Complete transaction flow", () => {
    it("should create transaction, publish event and process status", async () => {
      // Arrange
      const logger = pino({ level: "silent" });
      const service = new TransactionGraphQLService({
        prisma,
        kafka,
        topics,
        logger
      });

      // Start status consumer if not already running
      if (!statusConsumer) {
        statusConsumer = await startTransactionStatusConsumer({
          kafka,
          env,
          prisma,
          logger
        });
        // Wait for consumer to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const input = {
        accountExternalIdDebit: randomUUID(),
        accountExternalIdCredit: randomUUID(),
        transferTypeId: 1,
        value: 750.00
      };

      // Act - Step 1: Create transaction
      const created = await service.createTransaction(null, { input });
      expect(created.transactionStatus.name).toBe(TransactionStatusName.pending);

      // Act - Step 2: Simulate antifraud response (rejected for high value)
      const statusEvent: TransactionStatusEvent = {
        transactionExternalId: created.transactionExternalId,
        status: "rejected",
        processedAt: new Date().toISOString()
      };

      await producer.send({
        topic: topics.transactionStatus,
        messages: [{
          key: statusEvent.transactionExternalId,
          value: JSON.stringify(statusEvent)
        }]
      });

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Assert - Verify final status
      const final = await service.transaction(null, {
        transactionExternalId: created.transactionExternalId
      });
      expect(final?.transactionStatus.name).toBe(TransactionStatusName.rejected);
    }, 25000);
  });
});
