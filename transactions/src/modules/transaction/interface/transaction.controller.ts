import {
  Body,
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Param,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { TransactionService } from '../application/transaction.service';
import { CreateTransactionDto } from '../application/dto/create-transaction.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaTransactionStatusMessage } from '../application/dto/kafka-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':id')
  async getTransaction(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.transactionService.getTransaction(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @MessagePattern('transaction.approved')
  async handleTransactionApproved(
    @Payload(new ValidationPipe()) message: KafkaTransactionStatusMessage,
  ) {
    Logger.log('Transaction approved');
    Logger.log(message);
    const { id } = message;
    return this.transactionService.handleTransactionApproved(id);
  }

  @MessagePattern('transaction.declined')
  async handleTransactionStatusUpdate(
    @Payload(new ValidationPipe()) message: KafkaTransactionStatusMessage,
  ) {
    Logger.log('Transaction declined');
    Logger.log(message);
    const { id } = message;
    return this.transactionService.handleTransactionDeclined(id);
  }
}
