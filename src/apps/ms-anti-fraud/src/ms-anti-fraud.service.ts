import { Injectable, Inject } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { AntiFraudClient } from './ms-anti-fraud.client'
import { TransactionProcessedEvent } from './events/transaction-processed.event'
import { ProcessedTransactionStatus } from './ms-anti-fraud.constants'

@Injectable()
export class AntiFraudService {
  constructor(
    private readonly antiFraudClient: AntiFraudClient,
    @Inject('KAFKA_ANTI_FRAUD_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  processTransaction(payload: any) {
    const status: ProcessedTransactionStatus = this.antiFraudClient.processTransaction()
    const processedPayload: TransactionProcessedEvent = new TransactionProcessedEvent(
      { transactionExternalId: payload.transactionExternalId, status }
    )
    this.kafkaClient.emit(
      'transaction_processed',
      processedPayload
    )
    console.log(`Emitting event transaction_processed: ${processedPayload}`)
  }
}
