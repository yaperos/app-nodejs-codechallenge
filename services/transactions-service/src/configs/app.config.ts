import { registerAs } from '@nestjs/config';
import { ENUM_APP_ENVIRONMENT } from '../app/constants/app.enum.constant';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    name: process.env.APP_NAME ?? 'transactions-service',
    env: process.env.APP_ENV ?? ENUM_APP_ENVIRONMENT.LOCAL,
    port: process.env.PORT,
    host: process.env.HOST,
  }),
);
