import {
  Body,
  Controller,
  Post,
  Param,
  ParseIntPipe,
  Get,
  Patch,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequest } from 'src/transactions/DTO/create-transactions.dto';
import { UpdateTransactionRequest } from './DTO/update-transaction.dto';
import { Transactions } from './transactions.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController implements OnModuleInit {
  constructor(
    private transactionService: TransactionsService,
    @Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka,
  ) {}

  @Post()
  createTransaction(@Body() newTransaction: CreateTransactionRequest) {
    return this.transactionService.createTransaction(newTransaction);
  }

  @Get(':transactionId')
  getTransaction(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<Transactions> {
    return this.transactionService.getTransaction(transactionId);
  }

  @Patch(':transactionId')
  updateTransaction(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body() upTransaction: UpdateTransactionRequest,
  ) {
    return this.transactionService.updateTransaction(
      transactionId,
      upTransaction,
    );
  }

  onModuleInit() {
    this.antifraudClient.subscribeToResponseOf('transaction_created');
  }
}
