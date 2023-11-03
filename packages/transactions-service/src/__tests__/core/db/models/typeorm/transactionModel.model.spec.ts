import { describe, expect, test } from '@jest/globals'
import { TransactionStatusEnum } from '../../../../../app/entities/enums/transactionStatus.enum'
import { TransactionTypeEnum } from '../../../../../app/entities/enums/transactionType.enum'
import TransactionEntity from '../../../../../app/entities/transaction.entity'
import TransactionModel from '../../../../../core/db/models/typeorm/transactionModel.model'

describe('Test suite for transactionModel class', () => {
  test('[HAPPY PATH] Transform from TransactionEntity to TransactionModel', () => {
    // Arrange
    const expectedModel = new TransactionModel('1234', 22, 'CREDIT', 'PENDING')

    const transactionEntity = new TransactionEntity('1234', 22, TransactionTypeEnum.CREDIT, TransactionStatusEnum.PENDING)
    // Act
    const result = TransactionModel.fromDomain(transactionEntity)

    // Assert
    expect(expectedModel).toEqual(result)
  })
  test('[HAPPY PATH] Transform from TransactionModel to TransactionEntity', () => {
    // Arrange
    const commonDate = new Date()
    const transactionModel = new TransactionModel('1234', 22, 'CREDIT', 'PENDING', commonDate)
    const expectedEntity = new TransactionEntity('1234', 22, TransactionTypeEnum.CREDIT, TransactionStatusEnum.PENDING, commonDate)
    // Act
    const result = transactionModel.toDomain()

    // Assert
    expect(expectedEntity).toEqual(result)
  })
})
