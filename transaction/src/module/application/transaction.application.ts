import { TransactionInfoEntity } from '../domain/entities/transaction-info.entity'
import { TransactionEntity } from '../domain/entities/transaction.entity'
import { TransactionRepository } from '../domain/repositories/transaction.repository'
import { CreateTransactionRequest } from '../infrastructure/interface/dtos/request/create-transaction.request'

export class TransactionApplication {
  constructor(private readonly transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository
  }

  public async registerTransaction(data: CreateTransactionRequest): Promise<TransactionInfoEntity> {
    const transactionValue = new TransactionEntity(data)
    const transaction = await this.transactionRepository.create(transactionValue)

    return new TransactionInfoEntity(transaction)
  }

  public async getTransaction(id: string): Promise<TransactionInfoEntity> {
    const result = await this.transactionRepository.find(id)

    return new TransactionInfoEntity(result)
  }
}
