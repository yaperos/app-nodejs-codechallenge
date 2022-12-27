import { TransactionStatusEnum } from '../../infrastructure/interface/dtos/enums/transaction-status.enum'

export class TransactionEventInput {
  readonly transactionExternalId: string
  readonly status: TransactionStatusEnum
}
