import { TransactionRepository } from 'src/shared/domain/transaction.repository';

export class TransactionFind {
  constructor(private readonly repository: TransactionRepository) {}

  async byId(id: string) {
    return this.repository.getById(id);
  }
}
