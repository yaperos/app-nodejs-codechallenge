import { Transaction } from '@prisma/client'
import { TransactionEntity } from '../entities/transaction.entity'

export interface TransactionRepository {
  create(data: TransactionEntity): Promise<Transaction>
  find(id: string): Promise<Transaction>
}
