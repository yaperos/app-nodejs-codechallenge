import { UnprocessableEntity, InternalServerError } from 'http-errors'
import { TransactionRepository } from '../domain/repositories/transaction.repository'
import prisma from './db/prisma'

export class TransactionInfrastructure implements TransactionRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: any) {
    try {
      return prisma.transaction.create({
        data,
      })
    } catch (error) {
      if (error instanceof Error) {
        return new UnprocessableEntity(error.message)
      }

      return new InternalServerError()
    }
  }

  async get(id: string) {
    try {
      return prisma.transaction.findUniqueOrThrow({
        where: {
          id,
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        return new UnprocessableEntity(error.message)
      }

      return new InternalServerError()
    }
  }
}
