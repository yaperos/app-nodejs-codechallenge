import { Kafka, Consumer, Producer, Admin, logLevel } from "kafkajs";
import { KafkaContainer, type StartedKafkaContainer } from "@testcontainers/kafka";
import { startAntifraudConsumer } from "../antifraud.consumer";
import { createKafkaClient } from "../../../messaging/kafka.client";
import { createKafkaProducer } from "../../../messaging/kafka.producer";
import { getKafkaTopics } from "../../../messaging/kafka.topics";
import type { TransactionCreatedEvent, TransactionStatusEvent } from "../../../messaging/events";
import type { Env } from "../../../config/env";
import pino from "pino";

describe("Antifraud Integration Tests", () => {
  let kafkaContainer: StartedKafkaContainer;
  let kafka: Kafka;
  let producer: Producer;
  let consumer: Consumer;
  let admin: Admin;
  let antifraudConsumer: Consumer;
  let env: Env;

  beforeAll(async () => {
    // Initialize Kafka container
    kafkaContainer = await new KafkaContainer()
      .withExposedPorts(9093)
      .start();

    const brokers = `${kafkaContainer.getHost()}:${kafkaContainer.getMappedPort(9093)}`;

    env = {
      KAFKA_BROKERS: brokers,
      KAFKA_CONSUMER_GROUP_ANTIFRAUD: "antifraud-test-group",
      KAFKA_CONSUMER_GROUP_TRANSACTIONS: "transactions-test-group",
      KAFKA_TRANSACTION_TOPIC: "test.transaction.created",
      KAFKA_STATUS_TOPIC: "test.transaction.status",
      NODE_ENV: "test"
    } as Env;

    kafka = new Kafka({
      brokers: [brokers],
      logLevel: logLevel.ERROR
    });

    admin = kafka.admin();
    await admin.connect();

    // Create topics
    const topics = getKafkaTopics(env);
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
  }, 60000);

  afterAll(async () => {
    if (antifraudConsumer) await antifraudConsumer.disconnect();
    if (consumer) await consumer.disconnect();
    if (producer) await producer.disconnect();
    if (admin) await admin.disconnect();
    if (kafkaContainer) await kafkaContainer.stop();
  }, 30000);

  describe("Transaction Processing", () => {
    it("should process and approve low value transaction", async () => {
      // Arrange
      const logger = pino({ level: "silent" });
      const topics = getKafkaTopics(env);

      // Start antifraud consumer
      antifraudConsumer = await startAntifraudConsumer({
        kafka,
        env,
        logger
      });

      // Wait for antifraud consumer to be ready
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Subscribe test consumer to read result
      await consumer.subscribe({ topic: topics.transactionStatus, fromBeginning: true });

      const receivedMessages: TransactionStatusEvent[] = [];
      let resolvePromise: () => void;
      const messagePromise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      await consumer.run({
        eachMessage: async ({ message }) => {
          if (message.value) {
            const event = JSON.parse(message.value.toString()) as TransactionStatusEvent;
            receivedMessages.push(event);
            resolvePromise();
          }
        }
      });

      // Wait for test consumer to be ready
      await new Promise(resolve => setTimeout(resolve, 1000));

      const transactionEvent: TransactionCreatedEvent = {
        transactionExternalId: "test-txn-001",
        accountExternalIdDebit: "acc-debit-001",
        accountExternalIdCredit: "acc-credit-001",
        value: 100.00
      };

      // Act
      await producer.send({
        topic: topics.transactionCreated,
        messages: [{
          key: transactionEvent.transactionExternalId,
          value: JSON.stringify(transactionEvent)
        }]
      });

      // Assert
      await Promise.race([
        messagePromise,
        new Promise(resolve => setTimeout(resolve, 10000))
      ]);
      expect(receivedMessages.length).toBeGreaterThan(0);
      expect(receivedMessages[0]).toMatchObject({
        transactionExternalId: "test-txn-001",
        status: "approved"
      });
      expect(receivedMessages[0].processedAt).toBeDefined();
    }, 25000);

    it("should process and reject high value transaction", async () => {
      // Arrange
      const logger = pino({ level: "silent" });
      const topics = getKafkaTopics(env);

      if (!antifraudConsumer) {
        antifraudConsumer = await startAntifraudConsumer({
          kafka,
          env,
          logger
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Create dedicated consumer for this test
      const testConsumer = kafka.consumer({ groupId: "test-reject-consumer" });
      await testConsumer.connect();
      await testConsumer.subscribe({ topic: topics.transactionStatus, fromBeginning: false });

      const receivedMessages: TransactionStatusEvent[] = [];
      let resolvePromise: () => void;
      const messagePromise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      await testConsumer.run({
        eachMessage: async ({ message }) => {
          if (message.value) {
            const event = JSON.parse(message.value.toString()) as TransactionStatusEvent;
            if (event.transactionExternalId === "test-txn-002") {
              receivedMessages.push(event);
              resolvePromise();
            }
          }
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const transactionEvent: TransactionCreatedEvent = {
        transactionExternalId: "test-txn-002",
        accountExternalIdDebit: "acc-debit-002",
        accountExternalIdCredit: "acc-credit-002",
        value: 10000.00 // High value to be rejected
      };

      // Act
      await producer.send({
        topic: topics.transactionCreated,
        messages: [{
          key: transactionEvent.transactionExternalId,
          value: JSON.stringify(transactionEvent)
        }]
      });

      // Assert
      await Promise.race([
        messagePromise,
        new Promise(resolve => setTimeout(resolve, 10000))
      ]);

      await testConsumer.disconnect();

      expect(receivedMessages.length).toBeGreaterThan(0);
      expect(receivedMessages[0]).toMatchObject({
        transactionExternalId: "test-txn-002",
        status: "rejected"
      });
      expect(receivedMessages[0].processedAt).toBeDefined();
    }, 20000);

    it("should process multiple transactions in sequence", async () => {
      // Arrange
      const logger = pino({ level: "silent" });
      const topics = getKafkaTopics(env);

      if (!antifraudConsumer) {
        antifraudConsumer = await startAntifraudConsumer({
          kafka,
          env,
          logger
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Create dedicated consumer for this test
      const testConsumer = kafka.consumer({ groupId: "test-batch-consumer" });
      await testConsumer.connect();
      await testConsumer.subscribe({ topic: topics.transactionStatus, fromBeginning: false });

      const transactions: TransactionCreatedEvent[] = [
        {
          transactionExternalId: "batch-001",
          accountExternalIdDebit: "acc-d-001",
          accountExternalIdCredit: "acc-c-001",
          value: 50.00
        },
        {
          transactionExternalId: "batch-002",
          accountExternalIdDebit: "acc-d-002",
          accountExternalIdCredit: "acc-c-002",
          value: 5000.00
        },
        {
          transactionExternalId: "batch-003",
          accountExternalIdDebit: "acc-d-003",
          accountExternalIdCredit: "acc-c-003",
          value: 200.00
        }
      ];

      const receivedMessages: TransactionStatusEvent[] = [];
      let resolvePromise: () => void;
      const messagePromise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      await testConsumer.run({
        eachMessage: async ({ message }) => {
          if (message.value) {
            const event = JSON.parse(message.value.toString()) as TransactionStatusEvent;
            if (event.transactionExternalId.startsWith("batch-")) {
              receivedMessages.push(event);
              if (receivedMessages.length === 3) {
                resolvePromise();
              }
            }
          }
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Act
      for (const transaction of transactions) {
        await producer.send({
          topic: topics.transactionCreated,
          messages: [{
            key: transaction.transactionExternalId,
            value: JSON.stringify(transaction)
          }]
        });
      }

      // Assert
      await Promise.race([
        messagePromise,
        new Promise(resolve => setTimeout(resolve, 20000))
      ]);

      await testConsumer.disconnect();

      expect(receivedMessages.length).toBeGreaterThanOrEqual(3);

      const batch001 = receivedMessages.find(m => m.transactionExternalId === "batch-001");
      expect(batch001?.status).toBe("approved");

      const batch002 = receivedMessages.find(m => m.transactionExternalId === "batch-002");
      expect(batch002?.status).toBe("rejected");

      const batch003 = receivedMessages.find(m => m.transactionExternalId === "batch-003");
      expect(batch003?.status).toBe("approved");
    }, 30000);
  });
});