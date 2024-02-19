import * as dotenv from 'dotenv';

dotenv.config();

export const configuration = {
  port: parseInt(process.env.PORT, 10) || 3000,
  kafka: {
    client: 'anti-fraud-app',
    broker: process.env.KAFKA_HOST,
  },
};
