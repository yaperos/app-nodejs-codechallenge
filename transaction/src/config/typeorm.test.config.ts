import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  entities: ['dist/**/entities/*.{ts,js}'],
  migrations: ['dist/**/migrations/*.{ts,js}'],
  database: 'test_db',
  // migrationsTableName: 'migrations',
  // migrationsRun: true,
  logging: ['query', 'error'],
  synchronize: true,
});
