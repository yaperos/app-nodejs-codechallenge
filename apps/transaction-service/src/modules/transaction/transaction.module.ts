import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { DBModule } from '../db-module/module';
import { LoggerModule } from 'modules/logger/logger.module';
import { ClientKafka, ClientsModule } from '@nestjs/microservices';
import { KAFKA_CLIENT_CONFIG } from '../../config/kafka';

@Module({
  imports: [
    DBModule,
    HttpModule,
    LoggerModule.forRoot('Transaction module'),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_CLIENT_CONFIG,
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, ClientKafka],
})
export class TransactionModule {}
