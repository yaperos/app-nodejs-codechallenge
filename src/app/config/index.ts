import 'dotenv/config';
const env = (key: string) => {
  return process.env[key];
};

export default {
  PORT: env('PORT') ?? 3000,
  NODE_ENV: env('NODE_ENV') ?? 'dev',
  MONGODB: env('MONGO_URL'),
  LOGGER_LEVELS: {
    DEBUG: 'debug',
    ERROR: 'error',
    INFO: 'info',
  },
};
