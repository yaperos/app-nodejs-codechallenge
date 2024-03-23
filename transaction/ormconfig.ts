import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [path.join(__dirname, 'src', '**', '*.entity.{ts,js}')],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development'
};

export default config;