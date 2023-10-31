import type TransactionEntity from '../entities/transaction.entity'

export default interface ITransactionService {
  validate: (entity: TransactionEntity) => Promise<void>
}
