import Transaction from '@context/transactions/domain/class/Transaction';
import { ITransactionRepository } from '@context/transactions/domain/contracts/ITransactionRepository';

export class GetTransactionByExternalId {
  private repository: ITransactionRepository;

  constructor(repository: ITransactionRepository) {
    this.repository = repository;
  }

  async run(externalId: number): Promise<Transaction> {
    return this.repository.findByExternalId(externalId);
  }
}
