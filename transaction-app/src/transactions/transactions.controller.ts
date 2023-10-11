import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern('createTransaction')
  create(@Payload() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @MessagePattern('findAllTransactions')
  findAll() {
    return this.transactionsService.findAll();
  }

  @MessagePattern('findOneTransaction')
  findOne(@Payload() id: number) {
    return this.transactionsService.findOne(id);
  }

  @MessagePattern('updateTransaction')
  update(@Payload() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(updateTransactionDto.id, updateTransactionDto);
  }

  @MessagePattern('removeTransaction')
  remove(@Payload() id: number) {
    return this.transactionsService.remove(id);
  }
}
