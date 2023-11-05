import { registerAs } from '@nestjs/config';

export default registerAs('express', () => ({
  port: process.env.PORT || 8081,
}));
