import { TransactionRepository } from '../repositories/transaction.repository';

export class GetTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  async execute(id: string) {
    return this.repository.getById(id);
  }
}