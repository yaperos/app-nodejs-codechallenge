import { Types } from 'mongoose'
import { ProcessedTransactionStatus } from '../ms-anti-fraud.constants'

export class TransactionProcessedEvent {
  transactionExternalId: Types.ObjectId
  status: ProcessedTransactionStatus

  constructor(data?: Partial<TransactionProcessedEvent>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  toString() {
    return JSON.stringify({
      transactionExternalId: this.transactionExternalId,
      status: this.status,
    })
  }
}
