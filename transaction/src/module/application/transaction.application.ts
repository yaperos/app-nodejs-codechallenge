import { TransactionInfoEntity } from '../domain/entities/transaction-info.entity'
import { TransactionEntity } from '../domain/entities/transaction.entity'
import { BrokerRepository } from '../domain/repositories/broker.repository'
import { TransactionRepository } from '../domain/repositories/transaction.repository'
import { CreateTransactionRequest } from '../infrastructure/interface/dtos/request/create-transaction.request'

export class TransactionApplication {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly brokerRepository: BrokerRepository,
  ) {
    this.transactionRepository = transactionRepository
    this.brokerRepository = brokerRepository
  }

  async registerTransaction(data: CreateTransactionRequest): Promise<TransactionInfoEntity> {
    const transactionValue = new TransactionEntity(data)
    const transaction = await this.transactionRepository.create(transactionValue)
    await this.brokerRepository.send({ transactionId: transaction.transactionExternalId, value: transaction.value })

    return new TransactionInfoEntity(transaction)
  }

  async getTransaction(id: string): Promise<TransactionInfoEntity> {
    const result = await this.transactionRepository.find(id)

    return new TransactionInfoEntity(result)
  }

  async receive(): Promise<void> {
    await this.brokerRepository.receive()
  }
}
