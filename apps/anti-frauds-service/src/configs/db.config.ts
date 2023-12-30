import { registerAs } from '@nestjs/config';

export default registerAs(
  'db',
  (): Record<string, any> => ({
    postgres: {
      password: process.env.POSTGRES_PASSWORD,
      user: process.env.POSTGRES_USER,
      name: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      ssl: process.env.POSTGRES_SSL,
      caCert: process.env.POSTGRES_CA_CERT,
    },
  }),
);
