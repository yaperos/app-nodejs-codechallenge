import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern('create_transaction')
  create(@Payload() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern('get_transaction')
  findOne(@Payload() transactionExternalId: string) {
    return this.transactionService.findOne(transactionExternalId);
  }

  // @MessagePattern('updateTransaction')
  // update(@Payload() updateTransactionDto: UpdateTransactionDto) {
  //   return this.transactionService.update(updateTransactionDto.id, updateTransactionDto);
  // }
}
