import { ProcessedTransactionStatus } from './ms-anti-fraud.constants'
import  { ProcessTransactionDto } from './dto/process-transaction.dto'

export class AntiFraudClient {
  processTransaction(payload) {
    const rand_value = Math.floor(Math.random() * 101 + 1)
    if (rand_value % 2 == 0) {
      return { ...payload, status: ProcessedTransactionStatus.APPROVED }
    }
    return { ...payload, status: ProcessedTransactionStatus.REJECTED }
  }
}