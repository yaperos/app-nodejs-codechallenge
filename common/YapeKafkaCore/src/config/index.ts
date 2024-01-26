import "dotenv/config";

export const ConfigEnv = {
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: (process.env.KAFKA_BROKERS || "")
      .split(",")
      .map((broker) => broker.trim())
      .filter(Boolean),
  },
  topics: {
    verifyTransaction: process.env.KAFKA_TOPIC_VERIFY_TRANSACTION || "verify-transaction-local",
    transactionRequest:
      process.env.KAFKA_TOPIC_TRANSACTION_REQUEST ||
      "transaction-request-local",
    transactionStatus:
      process.env.KAFKA_TOPIC_TRANSACTION_STATUS || "transaction-status-local",
    transactionError:
      process.env.KAFKA_TOPIC_TRANSACTION_ERROR || "transaction-error-local",
  },
};
