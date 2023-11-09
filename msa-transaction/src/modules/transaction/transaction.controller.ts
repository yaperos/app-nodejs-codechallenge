import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { v4 as uuidv4 } from 'uuid';
import { KAFKA_TRANSACTION_UPDATE } from '../../config/kafka.config';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('transactions')
export class TransactionController {
  private logger = new Logger(TransactionController.name);

  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create({
      ...createTransactionDto,
      id: uuidv4(),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @MessagePattern(KAFKA_TRANSACTION_UPDATE)
  update(@Payload() updateTransactionDto: UpdateTransactionDto) {
    this.logger.log(KAFKA_TRANSACTION_UPDATE, updateTransactionDto);
    return this.transactionService.update(
      updateTransactionDto.id,
      updateTransactionDto,
    );
  }
}
