import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController implements OnModuleInit {
  constructor(
    private transactionService: TransactionService,
    @Inject('ANTI_FRAUD_SERVICE') private readonly antiFraudClient: ClientKafka,
  ) {}

  onModuleInit() {
    this.antiFraudClient.subscribeToResponseOf('validate_transaction');
  }

  @Get()
  async listTransactions() {
    return await this.transactionService.listTransactions();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTransation(@Body() body: CreateTransactionDto) {
    return await this.transactionService.createTransaction(body);
  }
}
