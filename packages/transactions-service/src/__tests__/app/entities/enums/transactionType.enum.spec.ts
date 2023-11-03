import { describe, expect, test } from "@jest/globals";
import { TransactionTypeEnum, getTransactionTypeEnumFromValue } from "../../../../app/entities/enums/transactionType.enum";
import BadRequestException from "../../../../app/errors/exceptions/badRequest.exception";
import ErrorMessagesConstants from "../../../../shared/constants/errorMessages.constants";

describe('Tests for transaction transfer types based on enum resolution', () => {
  test('[HAPPY PATH] given a valid status type then no throw BadRequestException', () => {
    const transferTypes: string[] = ['credit', 'debit']
    for(let type of transferTypes) {
      expect(() => {getTransactionTypeEnumFromValue(type)}).not.toThrow()
    }
  })
  test('[HAPPY PATH] given a credit status type then return its enum representation', () => {
    const transferType: string = 'credit'
    expect(getTransactionTypeEnumFromValue(transferType)).toBe(TransactionTypeEnum.CREDIT)
  })
  test('[HAPPY PATH] given a debit status type then return its enum representation', () => {
    const transferType: string = 'debit'
    expect(getTransactionTypeEnumFromValue(transferType)).toBe(TransactionTypeEnum.DEBIT)
  })
  test('given an unknown status type then throw a BadRequestException', () => {
    const transferType: string = 'unknow'
    expect(() => getTransactionTypeEnumFromValue(transferType)).toThrow(BadRequestException)
  })
  test('given an unknown status type then throw a BadRequestException with message', () => {
    const transferType: string = 'unknow'
    try {
      getTransactionTypeEnumFromValue(transferType)
    } catch (error: any | BadRequestException) {
      expect(error.message).toBe('BadRequestException')
      expect(error.description).toBe(ErrorMessagesConstants.TRANSACTIONS.INVALID.TRANSACTION_TYPE)
    }
  })
})
