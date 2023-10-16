import { ProcessedTransactionStatus } from './ms-anti-fraud.constants'

export class AntiFraudClient {
  processTransaction(): ProcessedTransactionStatus {
    const rand_value = Math.floor(Math.random() * 101 + 1)
    if (rand_value % 2 == 0) {
      return ProcessedTransactionStatus.APPROVED
    }
    return ProcessedTransactionStatus.REJECTED
  }
}