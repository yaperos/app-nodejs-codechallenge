import { TransactionStatus } from '../ms-transactions.constants'
import { Types } from 'mongoose'

export class UpdateTransactionDto {
  status: TransactionStatus
  transactionId: Types.ObjectId

  constructor(data?: Partial<UpdateTransactionDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

}