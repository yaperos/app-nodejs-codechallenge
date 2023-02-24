import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, TransactionPattern } from './transaction.types';
import { EnvConfig } from '../../config/env.config';
import { ClientKafka } from '@nestjs/microservices';

@Controller('transactions')
export class TransactionController implements OnModuleInit {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject(EnvConfig.kafkaConfig().name)
    public readonly transactionClient: ClientKafka,
  ) {}
  onModuleInit() {
    this.transactionClient.subscribeToResponseOf(
      TransactionPattern.CREATE_TRANSACTION,
    );
  }

  @Post('create')
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTransactionDto);
  }
}
