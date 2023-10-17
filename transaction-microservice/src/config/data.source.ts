import {DataSource, DataSourceOptions} from 'typeorm';
 export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrationsRun: false,
  logging: false, 
 }

