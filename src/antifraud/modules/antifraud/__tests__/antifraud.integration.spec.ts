import { Kafka, Consumer, Producer, Admin, logLevel } from "kafkajs";
import { KafkaContainer, type StartedKafkaContainer } from "@testcontainers/kafka";
import { startAntifraudConsumer } from "../antifraud.consumer";
import { createKafkaClient } from "../../../messaging/kafka.client";
import { createKafkaProducer } from "../../../messaging/kafka.producer";
import { getKafkaTopics } from "../../../messaging/kafka.topics";
import type { TransactionCreatedEvent, TransactionStatusEvent } from "../../../messaging/events";
import type { Env } from "../../../config/env";
import pino from "pino";
import { randomUUID } from "node:crypto";

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
      logLevel: logLevel.NOTHING
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
    if (antifraudConsumer) {
      await antifraudConsumer.stop();
      await antifraudConsumer.disconnect();
    }
    if (consumer) {
      await consumer.stop();
      await consumer.disconnect();
    }
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
      await new Promise(resolve => setTimeout(resolve, 5000));

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
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transactionEvent: TransactionCreatedEvent = {
        transactionExternalId: randomUUID(),
        accountExternalIdDebit: randomUUID(),
        accountExternalIdCredit: randomUUID(),
        transferTypeId: 1,
        value: 100.00,
        createdAt: new Date().toISOString()
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
        transactionExternalId: transactionEvent.transactionExternalId,
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

      const transactionEvent: TransactionCreatedEvent = {
        transactionExternalId: randomUUID(),
        accountExternalIdDebit: randomUUID(),
        accountExternalIdCredit: randomUUID(),
        transferTypeId: 2,
        value: 10000.00, // High value to be rejected
        createdAt: new Date().toISOString()
      };

      const receivedMessages: TransactionStatusEvent[] = [];
      let resolvePromise: () => void;
      const messagePromise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      await testConsumer.run({
        eachMessage: async ({ message }) => {
          if (message.value) {
            const event = JSON.parse(message.value.toString()) as TransactionStatusEvent;
            if (event.transactionExternalId === transactionEvent.transactionExternalId) {
              receivedMessages.push(event);
              resolvePromise();
            }
          }
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

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

      await testConsumer.stop();
      await testConsumer.disconnect();

      expect(receivedMessages.length).toBeGreaterThan(0);
      expect(receivedMessages[0]).toMatchObject({
        transactionExternalId: transactionEvent.transactionExternalId,
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
          transactionExternalId: randomUUID(),
          accountExternalIdDebit: randomUUID(),
          accountExternalIdCredit: randomUUID(),
          transferTypeId: 1,
          value: 50.00,
          createdAt: new Date().toISOString()
        },
        {
          transactionExternalId: randomUUID(),
          accountExternalIdDebit: randomUUID(),
          accountExternalIdCredit: randomUUID(),
          transferTypeId: 1,
          value: 5000.00,
          createdAt: new Date().toISOString()
        },
        {
          transactionExternalId: randomUUID(),
          accountExternalIdDebit: randomUUID(),
          accountExternalIdCredit: randomUUID(),
          transferTypeId: 1,
          value: 200.00,
          createdAt: new Date().toISOString()
        }
      ];

      const receivedMessages: TransactionStatusEvent[] = [];
      let resolvePromise: () => void;
      const messagePromise = new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });

      const txnIds = transactions.map(t => t.transactionExternalId);

      await testConsumer.run({
        eachMessage: async ({ message }) => {
          if (message.value) {
            const event = JSON.parse(message.value.toString()) as TransactionStatusEvent;
            if (txnIds.includes(event.transactionExternalId)) {
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

      await testConsumer.stop();
      await testConsumer.disconnect();

      expect(receivedMessages.length).toBeGreaterThanOrEqual(3);

      const result1 = receivedMessages.find(m => m.transactionExternalId === transactions[0].transactionExternalId);
      expect(result1?.status).toBe("approved");

      const result2 = receivedMessages.find(m => m.transactionExternalId === transactions[1].transactionExternalId);
      expect(result2?.status).toBe("rejected");

      const result3 = receivedMessages.find(m => m.transactionExternalId === transactions[2].transactionExternalId);
      expect(result3?.status).toBe("approved");
    }, 30000);
  });
});