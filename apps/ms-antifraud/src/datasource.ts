import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import InitSeeder from './database/seeds/init.seeder';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const options = {
  type: 'postgres', 
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
  entities: [__dirname + '/common/entities/*.entity.{js,ts}'],
  migrations: [__dirname + '/database/migrations/*.{js,ts}'],
  seeds: [InitSeeder],
};

export const dataSource = new DataSource(
  options as DataSourceOptions & SeederOptions & TypeOrmModuleOptions
);
