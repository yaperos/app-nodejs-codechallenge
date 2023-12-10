import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import TransactionTypeSchema from './schemas/transaction-type.schema';
import { TransactionSchema } from './schemas/transaction.schema';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          ...configService.get('database'),
          entities: [TransactionTypeSchema, TransactionSchema],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
