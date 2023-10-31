import type TransactionEntity from '../entities/transaction.entity'

export default interface ITransactionsService {
  save: (t: TransactionEntity) => Promise<TransactionEntity>
  findAll: () => Promise<TransactionEntity[]>
  findByExternalId: (externalId: string) => Promise<TransactionEntity>
}
