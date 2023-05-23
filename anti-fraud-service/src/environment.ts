import { config } from 'dotenv';

// Config dotenv to access env vars
config();

export = {
  KAFKA_HOST: process.env.KAFKA_HOST_URL,
  PORT: process.env.PORT,
}
