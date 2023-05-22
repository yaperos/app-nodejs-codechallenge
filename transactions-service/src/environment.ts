import { config } from 'dotenv';

config();

export = {
  KAFKA_HOST: process.env.KAFKA_HOST_URL,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
}
