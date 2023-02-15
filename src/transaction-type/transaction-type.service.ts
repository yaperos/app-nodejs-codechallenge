import { Injectable } from '@nestjs/common';
import { CreateTransactionTypeInput } from './dto/create-transaction-type.input';
import { UpdateTransactionTypeInput } from './dto/update-transaction-type.input';

@Injectable()
export class TransactionTypeService {
  create(createTransactionTypeInput: CreateTransactionTypeInput) {
    return 'This action adds a new transactionType';
  }

  findAll() {
    return `This action returns all transactionType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionType`;
  }

  update(id: number, updateTransactionTypeInput: UpdateTransactionTypeInput) {
    return `This action updates a #${id} transactionType`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionType`;
  }
}
