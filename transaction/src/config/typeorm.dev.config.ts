import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  database: configService.get('DB_NAME'),
  port: parseInt(configService.get('DB_PORT'), 10),
  host: configService.get('DB_HOST'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  synchronize: false,
  logging: ['query', 'error'],
  entities: ['dist/src/entities/*.{ts,js}'],
  migrations: ['dist/src/migrations/*.{ts,js}'],
  subscribers: [],
  migrationsTableName: 'migrations',
  migrationsRun: true,
});
