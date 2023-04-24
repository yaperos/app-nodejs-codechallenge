import { Body, Controller, Inject, OnModuleInit } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  ClientKafka,
  GrpcMethod,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction';
import { ITransactionValidate } from './interfaces/transaction.validate.interface';
import { EVENT_TRANSACTION_SUCCESS } from 'src/constants';
import { EVENT_TRANSACTION_FAILED } from 'src/constants';
import { EVENT_TRANSACTION_VALIDATE } from 'src/constants';
import { TRANSACTION_STATUS } from './interfaces/transaction.status.interface';

@Controller()
export class TransactionController implements OnModuleInit {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('ANTI_FRAUD_PACKAGE') private clientKafka: ClientKafka,
  ) {}

  onModuleInit() {
    this.clientKafka.subscribeToResponseOf(EVENT_TRANSACTION_VALIDATE);
  }

  @GrpcMethod('TransactionService', 'GetTransaction')
  getTransaction(@Body() transactionId: { id: string }) {
    return this.transactionService.getTransaction(transactionId.id);
  }

  @GrpcMethod('TransactionService', 'CreateTransaction')
  createTransaction(@Body() createTransaction: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTransaction);
  }

  @MessagePattern(EVENT_TRANSACTION_SUCCESS)
  async transactionSuccess(@Payload() data: ITransactionValidate) {
    return this.transactionService.updateTransactionStatus(
      data.id,
      TRANSACTION_STATUS.APPROVED,
    );
  }

  @MessagePattern(EVENT_TRANSACTION_FAILED)
  async transactionFailed(@Payload() data: ITransactionValidate) {
    return this.transactionService.updateTransactionStatus(
      data.id,
      TRANSACTION_STATUS.REJECTED,
    );
  }
}
