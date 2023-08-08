import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from '../commons/enums';
import { Transaction } from '../models';
import { TransactionStatus } from '../models/transactionStatus.entity';
import { TransactionType } from '../models/transactionType.entity';
import { InitSeeder } from './seeds';

export const DatabaseProvider: DynamicModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  async useFactory(config: ConfigService) {
    const isLocaloOrDevelopment =
      config.get('NODE_ENV') === Environment.Local ||
      config.get('NODE_ENV') === Environment.Development;
    return {
      type: 'postgres',
      host: config.get('DB_'),
      port: 5432,
      database: config.get('DB_NAME'),
      username: config.get('DB_USER'),
      password: config.get('DB_PASSWORD'),
      autoLoadEntities: true,
      synchronize: isLocaloOrDevelopment,
      entities: [Transaction, TransactionStatus, TransactionType],
      logging: config.get('DB_LOGGING'),
      //seeds: [InitSeeder],
    };
  },
});
