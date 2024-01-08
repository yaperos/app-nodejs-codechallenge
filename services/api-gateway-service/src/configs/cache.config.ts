import { registerAs } from '@nestjs/config';

export default registerAs(
  'redis',
  (): Record<string, any> => ({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  }),
);
