import { getTransactionStatusFromValue } from '../../../app/entities/enums/transactionStatus.enum'
import TransactionEntity from '../../../app/entities/transaction.entity'
import type ITransactionService from '../../../app/services/transaction.service'
import type ITransactionEvent from './interfaces/transactionEventModel'

export default class TransactionConsumerAdapter {
  private readonly _transactionsService: ITransactionService

  constructor (transactionService: ITransactionService) {
    this._transactionsService = transactionService
  }

  public async validateTransaction (transactionRawData: ITransactionEvent): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { transaction_external_id, transaction_status, value } = transactionRawData

    const transactionEntity: TransactionEntity = new TransactionEntity(
      transaction_external_id,
      value,
      getTransactionStatusFromValue(transaction_status)
    )
    await this._transactionsService.validate(transactionEntity)
  }
}
