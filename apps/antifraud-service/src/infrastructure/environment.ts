const validateRequiredEnv = (env: Record<string, unknown>) => {
  Object.entries(env).forEach(([key, value]) => {
    if (!value) {
      throw new Error(`Missing env variable ${key}`);
    }
  });
};

export const KAFKA_BROKERS = process.env.KAFKA_BROKERS || '';
export const TRANSACTION_CREATED_EVENT_TOPIC =
  process.env.TRANSACTION_CREATED_EVENT_TOPIC || '';
export const TRANSACTION_APPROVED_EVENT_TOPIC =
  process.env.TRANSACTION_APPROVED_EVENT_TOPIC || '';
export const TRANSACTION_REJECTED_EVENT_TOPIC =
  process.env.TRANSACTION_REJECTED_EVENT_TOPIC || '';

validateRequiredEnv({
  KAFKA_BROKERS,
  TRANSACTION_APPROVED_EVENT_TOPIC,
  TRANSACTION_CREATED_EVENT_TOPIC,
  TRANSACTION_REJECTED_EVENT_TOPIC,
});
