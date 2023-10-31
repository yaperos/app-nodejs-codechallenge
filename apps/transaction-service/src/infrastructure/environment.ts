const validateRequiredEnv = (env: Record<string, unknown>) => {
  Object.entries(env).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Missing env variable ${key}`);
    }
  });
};

export const PORT = +(process.env.PORT || 3000);
export const DATABASE_CONNECTION_URL =
  process.env.DATABASE_CONNECTION_URL || '';
export const DATABASE_USER = process.env.DATABASE_USER || '';
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
export const DATABASE_NAME = process.env.DATABASE_NAME || '';
export const DATABASE_NAMESPACE = process.env.DATABASE_NAMESPACE || '';
export const KAFKA_BROKERS = process.env.KAFKA_BROKERS || '';
export const TRANSACTION_CREATED_EVENT_TOPIC =
  process.env.TRANSACTION_CREATED_EVENT_TOPIC || '';
export const TRANSACTION_APPROVED_EVENT_TOPIC =
  process.env.TRANSACTION_APPROVED_EVENT_TOPIC || '';
export const TRANSACTION_REJECTED_EVENT_TOPIC =
  process.env.TRANSACTION_REJECTED_EVENT_TOPIC || '';

validateRequiredEnv({
  DATABASE_CONNECTION_URL,
  DATABASE_NAME,
  DATABASE_NAMESPACE,
  DATABASE_PASSWORD,
  DATABASE_USER,
  KAFKA_BROKERS,
  PORT,
  TRANSACTION_APPROVED_EVENT_TOPIC,
  TRANSACTION_CREATED_EVENT_TOPIC,
  TRANSACTION_REJECTED_EVENT_TOPIC,
});
