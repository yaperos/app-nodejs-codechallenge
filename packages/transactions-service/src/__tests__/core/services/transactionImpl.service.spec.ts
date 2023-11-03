import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import TransactionsImplementationService from '../../../core/services/transactionImpl.service'
import { TransactionStatusEnum } from '../../../app/entities/enums/transactionStatus.enum'
import { TransactionTypeEnum } from '../../../app/entities/enums/transactionType.enum'
import TransactionEntity from '../../../app/entities/transaction.entity'
import type ITransactionsService from '../../../app/services/transactions.service'
import BadRequestException from '../../../app/errors/exceptions/badRequest.exception'
import ResourceNotFoundException from '../../../app/errors/exceptions/resourceNotFound.exception'

const transactions: TransactionEntity[] = [
  new TransactionEntity('1234', 34, TransactionTypeEnum.CREDIT, TransactionStatusEnum.PENDING),
  new TransactionEntity('4312', 233, TransactionTypeEnum.CREDIT, TransactionStatusEnum.APPROVED),
  new TransactionEntity('4214', 5434, TransactionTypeEnum.CREDIT, TransactionStatusEnum.REJECTED)
]

const persistenceServiceFindAllMock = jest.fn()
const persistenceServiceFindOneByExternalId = jest.fn()
const persistenceServiceSaveMock = jest.fn()
const persistenceServiceUpdateTransactionStatusMock = jest.fn()

const persistenceServiceFindAllMockImplementation = {
  findAll: persistenceServiceFindAllMock,
  findOneByExternalId: persistenceServiceFindOneByExternalId,
  save: persistenceServiceSaveMock,
  updateTransactionStatus: persistenceServiceUpdateTransactionStatusMock
}

const notificationServiceMock = jest.fn()
const notificationServiceMockImplementation = {
  notify: notificationServiceMock
}

describe('Test for TransactionServicesImplementation', () => {
  const service: ITransactionsService = new TransactionsImplementationService(
    persistenceServiceFindAllMockImplementation as any,
    notificationServiceMockImplementation as any)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('[HAPPY PATH] Giving a call for getting all record then return the existing transactions', async () => {
    // Arrange
    persistenceServiceFindAllMock.mockResolvedValue(transactions as never)

    // Act
    const result = await service.findAll()

    // Assert
    expect(result.length).toBe(transactions.length)
    expect(persistenceServiceFindAllMock).toBeCalledTimes(1)
  })

  test('[HAPPY PATH] Giving a call with an externalTransactionId then return the existing record', async () => {
    // Arrange
    const externalTransactionId = '1234'
    const expected = new TransactionEntity(externalTransactionId, 34, TransactionTypeEnum.CREDIT, TransactionStatusEnum.PENDING)
    persistenceServiceFindOneByExternalId.mockResolvedValue(transactions[0] as never)

    // Act
    const result = await service.findByExternalId(externalTransactionId)

    // Assert
    expect(expected).toEqual(result)
    expect(persistenceServiceFindOneByExternalId).toBeCalledWith(externalTransactionId)
    expect(persistenceServiceFindOneByExternalId).toBeCalledTimes(1)
  })

  test('[HAPPY PATH] Giving a call with TransactionEntity then save it record return with the creation date', async () => {
    // Arrange
    const date = new Date()
    const externalTransactionId = '1234'
    const transactionEntityRequest = new TransactionEntity(externalTransactionId, 34, TransactionTypeEnum.CREDIT)
    const transactionEntity = new TransactionEntity(externalTransactionId, 34, TransactionTypeEnum.CREDIT, TransactionStatusEnum.PENDING)
    const expected = new TransactionEntity(externalTransactionId, 34, TransactionTypeEnum.CREDIT, TransactionStatusEnum.PENDING, date)

    persistenceServiceFindOneByExternalId.mockResolvedValue(null as never)
    persistenceServiceSaveMock.mockResolvedValue(transactionEntity.withCreatedAt(date) as never)
    notificationServiceMock.mockResolvedValue(undefined as never)

    // Act
    const result = await service.save(transactionEntityRequest)

    // Assert
    expect(expected).toEqual(result)
    expect(persistenceServiceFindOneByExternalId).toBeCalledWith(externalTransactionId)
    expect(persistenceServiceFindOneByExternalId).toBeCalledTimes(1)
    expect(persistenceServiceSaveMock).toBeCalledWith(transactionEntity)
    expect(persistenceServiceSaveMock).toBeCalledTimes(1)
    expect(notificationServiceMock).toBeCalledTimes(1)
  })

  test('[HAPPY PATH] Giving a call with externalTransactionId and new status then update it record return with the updatedAt date', async () => {
    // Arrange
    const createdAt = new Date()
    const updatedAt = new Date()
    const externalTransactionId = '1234'
    const newTransactionStatus = TransactionStatusEnum.APPROVED

    const transactionEntityFound = new TransactionEntity(externalTransactionId, 34, TransactionTypeEnum.CREDIT, TransactionStatusEnum.PENDING, createdAt)
    const expected = new TransactionEntity(externalTransactionId, 34, TransactionTypeEnum.CREDIT, newTransactionStatus, createdAt, updatedAt)

    persistenceServiceFindOneByExternalId.mockResolvedValue(transactionEntityFound as never)
    persistenceServiceUpdateTransactionStatusMock.mockResolvedValue(transactionEntityFound.withStatus(newTransactionStatus).withUpdatedAt(updatedAt) as never)

    // Act
    const result = await service.updateStatus(externalTransactionId, newTransactionStatus)

    // Assert
    expect(expected).toEqual(result)
    expect(persistenceServiceFindOneByExternalId).toBeCalledWith(externalTransactionId)
    expect(persistenceServiceFindOneByExternalId).toBeCalledTimes(1)
    expect(persistenceServiceUpdateTransactionStatusMock).toBeCalledWith(transactionEntityFound.withStatus(newTransactionStatus))
    expect(persistenceServiceUpdateTransactionStatusMock).toBeCalledTimes(1)
  })

  test('Giving a call with externalTransactionId and new status is new status is equals to the last status do nothing and return the found transaction', async () => {
    // Arrange
    const externalTransactionId = '1234'
    const transactionEntityFound = new TransactionEntity(externalTransactionId, 34, TransactionTypeEnum.CREDIT, TransactionStatusEnum.APPROVED, new Date(), new Date())

    persistenceServiceFindOneByExternalId.mockResolvedValue(transactionEntityFound as never)

    // Act
    const result = await service.updateStatus(externalTransactionId, TransactionStatusEnum.APPROVED)

    // Assert
    expect(transactionEntityFound).toEqual(result)
    expect(persistenceServiceFindOneByExternalId).toBeCalledWith(externalTransactionId)
    expect(persistenceServiceFindOneByExternalId).toBeCalledTimes(1)
    expect(persistenceServiceUpdateTransactionStatusMock).toBeCalledTimes(0)
  })

  test('Giving a call with externalTransactionId and new status if the transaction doest not exists then throw ResourceNotFoundException', async () => {
    // Arrange
    const externalTransactionId = '1234'
    const newTransactionStatus = TransactionStatusEnum.APPROVED

    persistenceServiceFindOneByExternalId.mockResolvedValue(null as never)

    // Act
    try {
      await service.updateStatus(externalTransactionId, newTransactionStatus)
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundException)
    }

    // Assert
    expect(persistenceServiceFindOneByExternalId).toBeCalledWith(externalTransactionId)
    expect(persistenceServiceFindOneByExternalId).toBeCalledTimes(1)
    expect(persistenceServiceUpdateTransactionStatusMock).toBeCalledTimes(0)
  })

  test('Giving a call with an existing TransactionEntity then throw a BadRequestException', async () => {
    // Arrange
    const date = new Date()
    const externalTransactionId = '1234'
    const transactionEntityRequest = new TransactionEntity(externalTransactionId, 34, TransactionTypeEnum.CREDIT)
    const transactionEntityFound = new TransactionEntity(externalTransactionId, 34, TransactionTypeEnum.CREDIT, TransactionStatusEnum.PENDING, date)

    persistenceServiceFindOneByExternalId.mockResolvedValue(transactionEntityFound as never)
    persistenceServiceSaveMock.mockResolvedValue(undefined as never)

    // Act
    try {
      await service.save(transactionEntityRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
    }

    // Assert
    expect(persistenceServiceFindOneByExternalId).toBeCalledWith(externalTransactionId)
    expect(persistenceServiceFindOneByExternalId).toBeCalledTimes(1)
    expect(persistenceServiceSaveMock).toBeCalledTimes(0)
  })

  test('Giving a call with an externalTransactionId representing a no existing transaction then throw a ResourceNotFoundException', async () => {
    // Arrange
    const externalTransactionId = '1234'
    persistenceServiceFindOneByExternalId.mockResolvedValue(null as never)

    // Act
    try {
      await service.findByExternalId(externalTransactionId)
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundException)
    }

    // Assert
    expect(persistenceServiceFindOneByExternalId).toBeCalledWith(externalTransactionId)
    expect(persistenceServiceFindOneByExternalId).toBeCalledTimes(1)
  })
})
