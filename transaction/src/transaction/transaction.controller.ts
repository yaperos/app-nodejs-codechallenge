import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async listTransactions() {
    return await this.transactionService.listTransactions();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTransation(@Body() body: CreateTransactionDto) {
    return await this.transactionService.createTransaction(body);
  }

  @EventPattern('transaction_created')
  async handleTransactionCreated(data: any) {
    console.log('Evento transaction_created recibido:', data.value);
  }
}
