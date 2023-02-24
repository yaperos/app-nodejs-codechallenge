import { DataSourceOptions } from 'typeorm';
import { EnvConfig } from './env.config';

export class DatabaseConfig {
  static get get(): DataSourceOptions {
    const dbConfig = EnvConfig.dbConfig();
    return {
      type: 'postgres',
      ...dbConfig,
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    };
  }
}
