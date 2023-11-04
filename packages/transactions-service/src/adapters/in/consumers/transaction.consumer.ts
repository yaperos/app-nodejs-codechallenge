import { getTransactionStatusFromValue } from '../../../app/entities/enums/transactionStatus.enum'
import type ITransactionsService from '../../../app/services/transactions.service'
import TransactionsImplementationService from '../../../core/services/transactionImpl.service'
import { databaseInstance, transactionMessageManagerInstance } from '../../../globals'
import TransactionOutDbAdapter from '../../out/db/transactionOutDb.adapter'
import type ITransactionEvent from '../../out/producers/interfaces/transactionEvent.interface'
import TransactionsKafkaProducerAdapter from '../../out/producers/transactionsKafka.producer'

export default class TransactionConsumerAdapter {
  private readonly _location: string = 'TransactionConsumerAdapter'
  private readonly transactionsService: ITransactionsService

  constructor () {
    this.transactionsService = new TransactionsImplementationService(
      new TransactionOutDbAdapter(databaseInstance),
      new TransactionsKafkaProducerAdapter(transactionMessageManagerInstance)
    )
  }

  public async update (transaction: ITransactionEvent): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { transaction_external_id, transaction_status } = transaction
    const status = getTransactionStatusFromValue(transaction_status)
    await this.transactionsService.updateStatus(transaction_external_id, status)
  }
}
