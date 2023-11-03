import { describe, test, expect } from "@jest/globals";
import { TransactionStatusEnum, getTransactionStatusFromValue } from "../../../../app/entities/enums/transactionStatus.enum";
import BadRequestException from "../../../../app/errors/exceptions/badRequest.exception";
import ErrorMessagesConstants from "../../../../shared/constants/errorMessages.constants";

describe('Tests for transaction status types based on enum resolution', () => {
  test('Given each one of  valid transaction status type not thrown a common error', () => {
    const statusTypes: string[] = ['APPROVED', 'REJECTED', 'PENDING']
    for(let status of statusTypes ){
      expect(() => { getTransactionStatusFromValue(status) }).not.toThrow()
    }
  })
  test('Given status APPROVED as string then return the enum representation', () => {
    const status: string = 'APPROVED'
    expect(getTransactionStatusFromValue(status)).toBe(TransactionStatusEnum.APPROVED)
  })
  test('Given status APPROVED as string then return the enum representation', () => {
    const status: string = 'REJECTED'
    expect(getTransactionStatusFromValue(status)).toBe(TransactionStatusEnum.REJECTED)
  })
  test('Given status APPROVED as string then return the enum representation', () => {
    const status: string = 'PENDING'
    expect(getTransactionStatusFromValue(status)).toBe(TransactionStatusEnum.PENDING)
  })
  test('Given an invalid status as string then throw a BadRequestException', () => {
    const status: string = 'UNKNOQN'
    expect(() => {getTransactionStatusFromValue(status)}).toThrow(BadRequestException)
  })
  test('Given an invalid status as string then throw a BadRequestException with message ', () => {
    const status: string = 'UNKNOQN'
    try {
      getTransactionStatusFromValue(status)
    } catch (error: any | BadRequestException) {
      expect(error.message).toBe('BadRequestException')
      expect(error.description).toBe(ErrorMessagesConstants.TRANSACTIONS.INVALID.TRANSACTION_STATUS)
    }
  })
})
