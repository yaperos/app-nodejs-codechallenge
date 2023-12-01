import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: 3000,
  nodeEnv: `${process.env.NODE_ENV}`,
}));
