import { TransactionStatus } from '../ms-transactions.constants'
import { Types } from 'mongoose'

export class TransactionCreatedEvent {
  status: TransactionStatus
  transactionId: Types.ObjectId

  constructor(data?: Partial<TransactionCreatedEvent>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toString() {
    return JSON.stringify({
      status: this.status,
      transactionId: this.transactionId
    })
  }
}