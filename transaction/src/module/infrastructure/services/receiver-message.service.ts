import { KafkaMessage } from 'kafkajs'
import { logger } from '../../../core/utils/logger'
import { TransactionEventInput } from '../../domain/entities/transaction-event-input.entity'
import { TransactionService } from './transaction.service'

export class RecevierMessageService {
  static async receiveMessage(message: KafkaMessage): Promise<void> {
    try {
      const inputMessage = message?.value?.toString() || ''
      const { transactionExternalId, status } = <TransactionEventInput>JSON.parse(inputMessage)

      if (transactionExternalId) {
        await TransactionService.update(transactionExternalId, status)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}
