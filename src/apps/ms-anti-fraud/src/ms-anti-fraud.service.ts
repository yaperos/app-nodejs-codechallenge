import { Injectable, Inject } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { AntiFraudClient } from './ms-anti-fraud.client'
import { ProcessTransactionDto } from './dto/process-transaction.dto'


@Injectable()
export class AntiFraudService {
  constructor(
    private readonly antiFraudClient: AntiFraudClient,
    @Inject('transaction-service')
    private readonly kafkaClient: ClientKafka,
  ) {}

  processTransaction(payload: any) {
    const processedTransaction = this.antiFraudClient.processTransaction(payload)
    this.kafkaClient.emit(
      'transaction_processed',
      processedTransaction
    )
  }
}
