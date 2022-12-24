/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionRepository } from '../domain/repositories/transaction.repository'

export class TransactionApplication {
  constructor(private readonly transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async registerTransaction(data: any) {
    const transaction = await this.transactionRepository.create(data)

    return transaction
  }

  public async getTransaction(id: string) {
    const result = await this.transactionRepository.get(id)

    return result
  }
}
