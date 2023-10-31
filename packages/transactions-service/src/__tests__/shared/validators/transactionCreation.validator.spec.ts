import { describe, expect, test } from '@jest/globals'
import type TransactionCreationRequestModel from '../../../adapters/in/graphql/models/in/transactionCreationRequest.model'
import transactionCreationValidation from '../../../shared/validators/transactionCreation.validator'
import BadRequestException from '../../../app/errors/exceptions/badRequest.exception'

describe('Validate transaction data structure creation ', () => {
  const accountExternalIdDebit = 'djil-ejnf-edjf-34f'
  const accountExternalIdCredit = 'djil-ejnf-edjf-34f'
  const transferTypeIdDebit = 2
  const transferTypeIdCredit = 1
  test('[HAPPY PATH] Data structure incoming is correct (DEBIT)', () => {
    const transaction: TransactionCreationRequestModel = {
      accountExternalIdDebit,
      transferTypeId: transferTypeIdDebit,
      value: 20
    }
    expect(() => {
      transactionCreationValidation(transaction)
    }).not.toThrow()
  })
  test('[HAPPY PATH] Data structure incoming is correct (CREDIT)', () => {
    const transaction: TransactionCreationRequestModel = {
      accountExternalIdCredit,
      transferTypeId: transferTypeIdCredit,
      value: 20
    }
    expect(() => {
      transactionCreationValidation(transaction)
    }).not.toThrow()
  })
  test('Data structure with undefined transaction value', () => {
    const transaction: TransactionCreationRequestModel = {
      accountExternalIdCredit,
      transferTypeId: transferTypeIdCredit
    }
    expect(() => {
      transactionCreationValidation(transaction)
    }).toThrow(BadRequestException)
  })
  test('Data structure with undefined transferTypeId value', () => {
    const transaction: TransactionCreationRequestModel = {
      accountExternalIdCredit,
      value: 20
    }
    expect(() => {
      transactionCreationValidation(transaction)
    }).toThrow(BadRequestException)
  })
  test('Data structure with invalid value type', () => {
    const transaction: any = {
      accountExternalIdCredit,
      transferTypeId: transferTypeIdCredit,
      value: '20'
    }
    expect(() => {
      transactionCreationValidation(transaction)
    }).toThrow(BadRequestException)
  })
  test('Data structure with invalid transferTypeId type', () => {
    const transaction: any = {
      accountExternalIdCredit,
      transferTypeId: '1',
      value: 20
    }
    expect(() => {
      transactionCreationValidation(transaction)
    }).toThrow(BadRequestException)
  })
  test('Data structure with invalid transferTypeId greater than 2', () => {
    const transaction: any = {
      accountExternalIdCredit,
      transferTypeId: 3,
      value: 20
    }
    expect(() => {
      transactionCreationValidation(transaction)
    }).toThrow(BadRequestException)
  })
  test('Data structure with invalid transferTypeId less than 2', () => {
    const transaction: any = {
      accountExternalIdCredit,
      transferTypeId: -1,
      value: 20
    }
    expect(() => {
      transactionCreationValidation(transaction)
    }).toThrow(BadRequestException)
  })
  test('Data structure with no transaction identifier incoming', () => {
    const transaction: TransactionCreationRequestModel = {
      transferTypeId: 1,
      value: 20
    }
    expect(() => {
      transactionCreationValidation(transaction)
    }).toThrow(BadRequestException)
  })
  test('Data structure with no valid transaction combination identifier incoming', () => {
    const transaction: TransactionCreationRequestModel = {
      accountExternalIdDebit,
      transferTypeId: 1,
      value: 20
    }
    expect(() => {
      transactionCreationValidation(transaction)
    }).toThrow(BadRequestException)
  })
  test('Data structure with no valid transaction combination identifier incoming', () => {
    const transaction: TransactionCreationRequestModel = {
      accountExternalIdCredit,
      transferTypeId: 2,
      value: 20
    }
    expect(() => {
      transactionCreationValidation(transaction)
    }).toThrow(BadRequestException)
  })
})
