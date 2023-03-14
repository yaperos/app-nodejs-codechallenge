import { Controller } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { GetTransactionsQuery } from 'src/domain/querys';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly queryBus: QueryBus) {}
  @MessagePattern('find_all_transactions')
  findAll() {
    return this.queryBus.execute(new GetTransactionsQuery());
  }
}
