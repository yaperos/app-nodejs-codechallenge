import * as path from 'path';
import * as dotenv from 'dotenv';

const config = dotenv.config({
  path: path.resolve(__dirname, `../../config/.env.${process.env.NODE_ENV || 'dev'}`),
});

export const CONFIG = {
  APP: {
    PORT: config.parsed.PORT,
    API: config.parsed.API,
    ENVIRONMENT: config.parsed.ENVIRONMENT,
    LOG_LEVEL: config.parsed.LOG_LEVEL,
    NAME: config.parsed.NAME,
  },
  KAFKA: {
    URL: config.parsed.KAFKA_URL,
  },
  DATABASE: {
    MONGO: {
      HOST: config.parsed.MONGO_HOST,
      PORT: config.parsed.MONGO_PORT,
      NAME: config.parsed.MONGO_NAME,
      USER: config.parsed.MONGO_USER,
      PASSWORD: config.parsed.MONGO_PASSWORD,
    }
  }
};
