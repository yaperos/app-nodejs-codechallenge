import 'dotenv/config';
const env = (key: string) => {
  return process.env[key];
};

export default {
  PORT: env('PORT') ?? 3001,
  NODE_ENV: env('NODE_ENV') ?? 'dev',
  DB: {
    HOST: env('DB_HOST'),
    PORT: +env('DB_PORT')! ?? 3306,
    USERNAME: env('DB_USERNAME'),
    PASSWORD: env('DB_PASSWORD'),
    NAME: env('DB_NAME'),
  },
  LOGGER_LEVELS: {
    DEBUG: 'debug',
    ERROR: 'error',
    INFO: 'info',
  },
};
