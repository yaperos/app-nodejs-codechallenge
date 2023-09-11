import { ObjectId } from 'mongodb';
import { TransactionRepository } from '../repositories/transaction.repository';

export class TransactionFindByIdQuery {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  handle(id: ObjectId) {
    return this.transactionRepository.findById(id);
  }
}
