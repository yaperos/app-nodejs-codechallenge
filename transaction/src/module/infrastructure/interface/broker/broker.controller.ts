import { logger } from '../../../../core/utils/logger'
import { TransactionApplication } from '../../../application/transaction.application'

export default class {
  constructor(private readonly transactionApplication: TransactionApplication) {}

  async listen() {
    await this.transactionApplication.receive()
    logger.info('🧿 Broker listening')
  }
}
