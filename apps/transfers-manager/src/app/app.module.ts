import { Module } from '@nestjs/common';

import { TransactionStatusModule } from './transaction-status/transaction-status.module';
import { TransactionCrudModule } from './transaction-crud/transaction-crud.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConnectionConfig from '../config/database-connection.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionEntity } from '@yape-transactions/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConnectionConfig],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return {
            type: 'postgres',
            host: configService.get('database.host'),
            port: configService.get<number>('database.port'),
            username: configService.get('database.usernmae'),
            password: configService.get('database.password'),
            database: configService.get('database.dbName'),
            synchronize: configService.get<boolean>('database.synchronize'),
            entities: [TransactionEntity]
          }
        }
      }
    ),
    TransactionCrudModule,
    TransactionStatusModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
