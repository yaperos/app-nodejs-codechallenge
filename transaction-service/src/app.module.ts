import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module';
import * as dotenv from 'dotenv';
import { typeOrmConfig } from './config/typeorm.config';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
