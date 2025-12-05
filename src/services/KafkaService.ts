import { Kafka, ITopicConfig } from "kafkajs";
import { Transaction } from "../entities/Transaction";
import { AppDataSource } from "../database/data-source";

// --- Kafka Configuration ---
const kafka = new Kafka({
  clientId: "anti-fraud-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
const TRANSACTION_CREATED_TOPIC = "transaction-created";
const TRANSACTION_STATUS_TOPIC = "transaction-status-updated";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ensures that all required Kafka topics exist.
 * If some topics are missing, they are created automatically.
 */
async function ensureTopicsExist() {
  const admin = kafka.admin();
  try {
    await admin.connect();

    console.log("[Kafka Admin] Connected to verify topics");

    const topicsToCreate: ITopicConfig[] = [
      {
        topic: TRANSACTION_CREATED_TOPIC,
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: TRANSACTION_STATUS_TOPIC,
        numPartitions: 1,
        replicationFactor: 1,
      },
    ];

    const existingTopics = await admin.listTopics();

    const topicsNeedingCreation = topicsToCreate.filter(
      (t) => !existingTopics.includes(t.topic)
    );

    if (topicsNeedingCreation.length > 0) {
      console.log(
        `[Kafka Admin] Creating ${topicsNeedingCreation.length} missing topic(s)...`
      );
      await admin.createTopics({
        topics: topicsNeedingCreation,
        waitForLeaders: true,
      });
      console.log("[Kafka Admin] Topics created successfully.");
    } else {
      console.log("[Kafka Admin] All required topics already exist.");
    }
  } catch (error) {
    console.error("[Kafka Admin] Error ensuring topics:", error);
    throw error;
  } finally {
    await admin.disconnect();
  }
}

/**
 * Establishes a Kafka producer connection with retries.
 */
export async function connectKafkaProducer() {
  const MAX_RETRIES = 5;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      // 1. Make sure topics are available
      await ensureTopicsExist();

      // 2. Connect the producer
      console.log("[Kafka] Connecting producer...");
      await producer.connect();
      console.log("[Kafka] Producer connected successfully.");
      return;
    } catch (error) {
      attempt++;

      const nextDelay = 2000 * Math.pow(2, attempt - 1);

      console.warn(
        `[Kafka] Attempt ${attempt} failed. Retrying in ${
          nextDelay / 1000
        }s. Error: ${(error as any).message}`
      );

      if (attempt >= MAX_RETRIES) {
        console.error(
          "[Kafka] FATAL: Maximum retry attempts reached. Kafka connection failed."
        );
        throw error;
      }

      await delay(nextDelay);
    }
  }
}

/**
 * Publishes a "transaction created" event.
 * This event is consumed by the Anti-Fraud service.
 */
export async function publishTransactionCreatedEvent(transaction: Transaction) {
  try {
    // Map and serialize message
    const message = {
      transactionExternalId: transaction.transactionExternalId,
      value: transaction.value,
    };

    await producer.send({
      topic: TRANSACTION_CREATED_TOPIC,
      messages: [
        {
          key: transaction.transactionExternalId,
          value: JSON.stringify(message),
        },
      ],
    });

    console.log(
      `[Kafka] 'Transaction Created' event sent for ID: ${transaction.transactionExternalId}`
    );
  } catch (error) {
    console.error("[Kafka] Error publishing event:", error);
  }
}

/**
 * Consumer 1 — Anti-Fraud Microservice.
 * Applies a simple rule: if value > 1000 ⇒ rejected, otherwise approved.
 * Then publishes the result to the "transaction-status-updated" topic.
 */
export async function startAntiFraudService() {
  const ANTI_FRAUD_GROUP_ID = "anti-fraud-processor";
  const consumer = kafka.consumer({ groupId: ANTI_FRAUD_GROUP_ID });

  await consumer.connect();

  // Subscribe to new transaction events
  await consumer.subscribe({
    topic: TRANSACTION_CREATED_TOPIC,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const transactionData = JSON.parse(message.value?.toString() || "{}");
      console.log(
        `[Anti-Fraud] Evaluating transaction: ${transactionData.transactionExternalId} (Value: ${transactionData.value})`
      );

      let newStatus = "approved";

      // BUSINESS RULE
      if (transactionData.value > 1000) {
        newStatus = "rejected";
      }

      // Publish fraud decision
      await producer.send({
        topic: TRANSACTION_STATUS_TOPIC,
        messages: [
          {
            key: transactionData.transactionExternalId,
            value: JSON.stringify({
              transactionExternalId: transactionData.transactionExternalId,
              newStatus: newStatus,
            }),
          },
        ],
      });

      console.log(
        `[Anti-Fraud] Decision for ${transactionData.transactionExternalId}: ${newStatus}. Published to ${TRANSACTION_STATUS_TOPIC}`
      );
    },
  });

  console.log(
    '[Kafka Consumer] Anti-Fraud Service started, listening on "transaction-created".'
  );
}

/**
 * Consumer 2 — Database Updater.
 * Listens to status updates and updates the transactionStatus field in the DB.
 */
export async function startStatusConsumer() {
  const STATUS_UPDATE_GROUP_ID = "transaction-status-group";
  const consumer = kafka.consumer({ groupId: STATUS_UPDATE_GROUP_ID });

  const transactionRepository = AppDataSource.getRepository(Transaction);

  await consumer.connect();

  // Subscribe to the status-update topic
  await consumer.subscribe({
    topic: TRANSACTION_STATUS_TOPIC,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value?.toString() || "{}");
      const { transactionExternalId, newStatus } = data;

      if (transactionExternalId && newStatus) {
        // Update transaction state in the DB
        await transactionRepository.update(
          { transactionExternalId },
          { transactionStatus: newStatus }
        );

        console.log(
          `[DB Updater] Status of ${transactionExternalId} updated to ${newStatus}`
        );
      }
    },
  });

  console.log(
    '[Kafka Consumer] DB Status Updater started, listening on "transaction-status-updated".'
  );
}