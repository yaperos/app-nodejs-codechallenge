import { NotFound, UnprocessableEntity, InternalServerError } from 'http-errors'
import { Prisma, Transaction } from '@prisma/client'
import { logger } from '../../core/utils/logger'
import { TransactionRepository } from '../domain/repositories/transaction.repository'
import { TransactionEntity } from '../domain/entities/transaction.entity'
import prisma from './db/prisma'

export class TransactionInfrastructure implements TransactionRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: TransactionEntity): Promise<Transaction> {
    try {
      const result = await prisma.transaction.create({
        data: {
          ...data,
          transactionStatus: 'pending',
        },
      })

      return result
    } catch (error) {
      logger.error(error)

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new UnprocessableEntity(error.message)
      }

      throw new InternalServerError()
    }
  }

  async find(id: string): Promise<Transaction> {
    try {
      const result = await prisma.transaction.findUniqueOrThrow({
        where: {
          transactionExternalId: id,
        },
      })

      return result
    } catch (error) {
      logger.error(error)

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFound(error.message)
        }

        throw new UnprocessableEntity(error.message)
      }

      throw new InternalServerError()
    }
  }
}
