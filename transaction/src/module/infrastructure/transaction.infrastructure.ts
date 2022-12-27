import { Transaction } from '@prisma/client'
import { TransactionRepository } from '../domain/repositories/transaction.repository'
import { TransactionEntity } from '../domain/entities/transaction.entity'
import { TransactionStatusEnum } from './interface/dtos/enums/transaction-status.enum'
import { TransactionService } from './services/transaction.service'
import { RedisService } from './services/redis.service'

export class TransactionInfrastructure implements TransactionRepository {
  async create(data: TransactionEntity): Promise<Transaction> {
    return TransactionService.create(data)
  }

  async find(id: string): Promise<Transaction> {
    return TransactionService.find(id)
  }

  async updateStatus(id: string, status: TransactionStatusEnum): Promise<Transaction> {
    await RedisService.delete(id)

    return TransactionService.update(id, status)
  }
}
