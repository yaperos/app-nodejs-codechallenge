import * as path from 'path';
import * as dotenv from 'dotenv';

const config = dotenv.config({
  path: path.resolve(__dirname, `../../config/.env.${process.env.NODE_ENV || 'dev'}`),
});

export const CONFIG = {
  APP: {
    ENVIRONMENT: config.parsed.ENVIRONMENT,
    LOG_LEVEL: config.parsed.LOG_LEVEL,
    NAME: config.parsed.NAME,
  },
  KAFKA: {
    URL: config.parsed.KAFKA_URL,
  },
};
