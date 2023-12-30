import { registerAs } from '@nestjs/config';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  }),
);
