import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ProducerService } from 'src/kafka/producer.service';

@Module({
	controllers: [TransactionController],
	providers: [TransactionService, ProducerService],
})
/* eslint-disable @typescript-eslint/no-extraneous-class */
export class TransactionModule {}
