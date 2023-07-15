import 'dotenv/config';

const env = {
  KAFKA_BROKER: process.env.KAFKA_BROKER || 'localhost:9092',
  MAX_TRANSACTION_VALUE: process.env.MAX_TRANSACTION_VALUE || 1000,
};

export default env;
