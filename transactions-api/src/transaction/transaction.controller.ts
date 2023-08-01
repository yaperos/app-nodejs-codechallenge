import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetTransactionDTO } from './dto/get-transaction.dto';
import { KafkaStreamPatterns } from '../shared/kafka/kafka-stream-patterns';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @MessagePattern(KafkaStreamPatterns.processedTransactions)
  async pullProcessedTransactions(
    @Payload() updateTransactionData: UpdateTransactionDto,
  ) {
    return this.transactionService.pullProcessedTransaction(
      updateTransactionData,
    );
  }

  // Using a POST since the service expects us to receive an object
  @Post('/get')
  getTransaction(@Body() getTransactionDTO: GetTransactionDTO) {
    return this.transactionService.getTransaction(getTransactionDTO);
  }
}
