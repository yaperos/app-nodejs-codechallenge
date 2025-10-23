import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME!,  
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.TYPEORM_LOGGING === 'true',
}));