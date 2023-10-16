import { Types } from 'mongoose'

export class TransactionCreatedEvent {
  transactionExternalId: Types.ObjectId

  constructor(data?: Partial<TransactionCreatedEvent>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId
    })
  }
}