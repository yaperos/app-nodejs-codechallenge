import { UnprocessableEntity, InternalServerError } from 'http-errors'
import { TransactionRepository } from '../domain/repositories/transaction.repository'
import prisma from './db/prisma'

export class TransactionInfrastructure implements TransactionRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: any) {
    try {
      return prisma.transaction.create({
        data: {
          accountExternalIdCredit: data.accountExternalIdCredit,
          accountExternalIdDebit: data.accountExternalIdDebit,
          transferType: data.transferType,
          value: data.value,
          transactionStatus: 'pending',
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntity(error.message)
      }

      throw new InternalServerError()
    }
  }

  async get(id: string) {
    try {
      return prisma.transaction.findUniqueOrThrow({
        where: {
          transactionExternalId: id,
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntity(error.message)
      }

      throw new InternalServerError()
    }
  }
}
