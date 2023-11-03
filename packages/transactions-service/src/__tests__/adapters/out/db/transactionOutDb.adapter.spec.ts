import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import type TransactionPersistenceRepository from '../../../../app/repositories/out/transactionPersistence.repository'
import TransactionModel from '../../../../core/db/models/typeorm/transactionModel.model'
import TransactionEntity from '../../../../app/entities/transaction.entity'
import { databaseInstance } from '../../../../globals'
import { TransactionTypeEnum } from '../../../../app/entities/enums/transactionType.enum'
import { TransactionStatusEnum } from '../../../../app/entities/enums/transactionStatus.enum'
import TransactionOutDbAdapter from '../../../../adapters/out/db/transactionOutDb.adapter'

const dummyTransactionsModels: TransactionModel[] = [
  new TransactionModel('1234', 22, 'CREDIT', 'PENDING', new Date()),
  new TransactionModel('4321', 344, 'DEBIT', 'PENDING', new Date()),
  new TransactionModel('3421', 388, 'CREDIT', 'APPROVED', new Date())
]
const expectedTransactions: TransactionEntity[] = dummyTransactionsModels.map(t => t.toDomain())

const transactionsModelMock = jest.fn()

jest.mock('../../../../globals.ts', jest.fn().mockImplementation(() => ({
  databaseInstance: {
    getDataSource: () => ({
      getRepository: (_: TransactionModel) => ({
        find: transactionsModelMock,
        findOneBy: transactionsModelMock,
        save: transactionsModelMock,
        createQueryBuilder: () => ({
          update: () => ({
            set: (_: any) => ({
              where: (_: any, c: any) => ({
                returning: () => ({
                  execute: transactionsModelMock
                })
              })
            })
          })
        })
      })
    })
  }
})))

describe('Test suite for TransactionOutDbAdapter', () => {
  const service: TransactionPersistenceRepository = new TransactionOutDbAdapter(databaseInstance)
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('[HAPPY PATH] Given a call for getting all transation then return records', async () => {
    // Arrange
    transactionsModelMock.mockResolvedValue(dummyTransactionsModels as never)

    // Act
    const result = await service.findAll()

    // Assert
    expect(result.length).toBe(expectedTransactions.length)
    expect(result).toEqual(expectedTransactions)
    expect(transactionsModelMock).toHaveBeenCalled()
    expect(transactionsModelMock).toBeCalledTimes(1)
  })

  test('[HAPPY PATH] Given one GUUID as externalTransactionId then searc and return the object', async () => {
    // Arrange
    transactionsModelMock.mockResolvedValue(dummyTransactionsModels[0] as never)

    // Act
    const result = await service.findOneByExternalId('1234')

    // Assert
    expect(result).toEqual(expectedTransactions[0])
    expect(transactionsModelMock).toBeCalledWith({ transaction_external_id: '1234' })
    expect(transactionsModelMock).toBeCalledTimes(1)
  })

  test('[HAPPY PATH] Given one GUUID as externalTransactionId then search and return the object', async () => {
    // Arrange
    transactionsModelMock.mockResolvedValue(dummyTransactionsModels[0] as never)

    // Act
    const result = await service.findOneByExternalId('1234')

    // Assert
    expect(result).toEqual(expectedTransactions[0])
    expect(transactionsModelMock).toBeCalledWith({ transaction_external_id: '1234' })
    expect(transactionsModelMock).toBeCalledTimes(1)
  })

  test('[HAPPY PATH] Given one GUUID as externalTransactionId then search and return the object', async () => {
    // Arrange
    transactionsModelMock.mockResolvedValue(dummyTransactionsModels[0] as never)

    // Act
    const result = await service.findOneByExternalId('1234')

    // Assert
    expect(result).toEqual(expectedTransactions[0])
    expect(transactionsModelMock).toBeCalledWith({ transaction_external_id: '1234' })
    expect(transactionsModelMock).toBeCalledTimes(1)
  })

  test('[HAPPY PATH] Given one transactionEntity then save it record and reurn it with cratedAt Date', async () => {
    // Arrange
    const expectedDate = new Date()
    const transactionModelReturn = new TransactionModel('1234', 22, 'CREDIT', 'PENDING', expectedDate)
    transactionsModelMock.mockResolvedValue(transactionModelReturn as never)
    const transactionEntity = new TransactionEntity('1234', 22, TransactionTypeEnum.CREDIT, TransactionStatusEnum.PENDING)
    const expectedTransactionEntity = transactionEntity.withCreatedAt(expectedDate)

    // Act
    const result = await service.save(transactionEntity)

    // Assert
    expect(result).toEqual(expectedTransactionEntity)
    expect(transactionsModelMock).toBeCalledWith(TransactionModel.fromDomain(transactionEntity))
    expect(transactionsModelMock).toBeCalledTimes(1)
  })

  test('[HAPPY PATH] Given one transactionEntity and update status invoke then update it record and return it with updated Date', async () => {
    // Arrange
    const createdAt = new Date()
    const updatedAt = new Date()
    const transactionEntity = new TransactionEntity('1234', 22, TransactionTypeEnum.CREDIT, TransactionStatusEnum.APPROVED, createdAt)
    const updateResult = {
      raw: [{ updated_at: updatedAt }],
      affected: 1,
      generatedMaps: []
    }
    transactionsModelMock.mockResolvedValue(updateResult as never)

    const expected = new TransactionEntity('1234', 22, TransactionTypeEnum.CREDIT, TransactionStatusEnum.APPROVED, createdAt, updatedAt)

    // Act
    const result = await service.updateTransactionStatus(transactionEntity)

    // Assert
    expect(result.updatedAt).toBe(expected.updatedAt)
    expect(result).toEqual(expected)
    expect(transactionsModelMock).toBeCalledTimes(1)
  })
})
