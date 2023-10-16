import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../config/database.config';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: 'dev.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('TransactionTypeOrm'),
    }),
    TypeOrmModule.forFeature([Transaction, TransactionType, TransactionStatus]),
  ],
  exports: [TypeOrmModule, ConfigModule],
})
export class DatabaseModule {}
