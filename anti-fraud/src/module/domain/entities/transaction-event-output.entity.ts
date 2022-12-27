import { TransactionStatusEnum } from '../../infrastructure/interface/dtos/enums/transaction-status.enum'

export class TransactionEventOutput {
  readonly transactionExternalId: string
  readonly status: TransactionStatusEnum
}
