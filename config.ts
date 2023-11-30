import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    postgres: {
      POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME,
      POSTGRES_DB_PORT: parseInt(process.env.POSTGRES_DB_PORT, 10),
      POSTGRES_DB_PASSWORD: process.env.POSTGRES_DB_PASSWORD,
      POSTGRES_DB_USER: process.env.POSTGRES_DB_USER,
      POSTGRES_DB_HOST: process.env.POSTGRES_DB_HOST,
    },
  };
});
