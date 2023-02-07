import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern('create_transaction')
  create(@Payload() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @MessagePattern('get_transaction')
  findOne(@Payload() transactionExternalId: string) {
    return this.transactionService.findOne(transactionExternalId);
  }
}
