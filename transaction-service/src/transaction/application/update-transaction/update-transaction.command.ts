import { ICommand } from "@nestjs/cqrs";

export enum TransactionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export class UpdateTransactionCommand implements ICommand {
  constructor(
    public readonly transactionId: string,
    public readonly transactionStatus: TransactionStatus
  ) {}
}
