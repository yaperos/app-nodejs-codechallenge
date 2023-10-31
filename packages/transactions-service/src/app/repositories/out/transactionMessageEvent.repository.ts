import type TransactionEntity from '../../entities/transaction.entity'

export default interface TransactionEventMessageRepository {
  notify: (transaction: TransactionEntity) => Promise<void>
}
