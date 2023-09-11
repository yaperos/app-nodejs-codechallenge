import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
}));
