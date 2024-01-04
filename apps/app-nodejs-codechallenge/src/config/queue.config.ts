import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodenv: process.env.NODE_ENV,
}));
