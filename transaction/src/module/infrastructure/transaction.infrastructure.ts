import { NotFound, UnprocessableEntity, InternalServerError } from 'http-errors'
import { Prisma, Transaction } from '@prisma/client'
import { logger } from '../../core/utils/logger'
import { TransactionRepository } from '../domain/repositories/transaction.repository'
import { TransactionEntity } from '../domain/entities/transaction.entity'
import prisma from './db/prisma'
import { TransactionStatusEnum } from './interface/dtos/enums/transaction-status.enum'

export class TransactionInfrastructure implements TransactionRepository {
  async create(data: TransactionEntity): Promise<Transaction> {
    try {
      const result = await prisma.transaction.create({
        data: {
          ...data,
          transactionStatus: TransactionStatusEnum.PENDING,
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

  async updateStatus(id: string, status: TransactionStatusEnum): Promise<Transaction> {
    try {
      const result = await prisma.transaction.update({
        where: {
          transactionExternalId: id,
        },
        data: {
          transactionStatus: status,
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
