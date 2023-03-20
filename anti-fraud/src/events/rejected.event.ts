import { CreatedEvent } from "./create.event";

export class RejectedEvent {
  static getName():string {
    return 'transaction.rejected'
  }

  static toEvent( transaction: CreatedEvent ):string {
    return JSON.stringify({
      transactionExternalId: transaction.transactionExternalId,
      transactionType: transaction.transactionType,
      transactionStatus: transaction.transactionStatus,
      value: transaction.value,
      createdAt: transaction.createdAt
    })
  }
}