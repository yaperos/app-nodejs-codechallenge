export class TransactionRejectedEvent {
  constructor(public readonly transactionId: string) {}
}
