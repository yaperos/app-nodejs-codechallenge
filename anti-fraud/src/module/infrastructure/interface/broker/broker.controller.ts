import { logger } from '../../../../core/utils/logger'
import { AntiFraudApplication } from '../../../application/anti-fraud.application'

export default class {
  constructor(private readonly transactionApplication: AntiFraudApplication) {}

  async listen() {
    await this.transactionApplication.receive()
    logger.info('🧿 Broker listening')
  }
}
