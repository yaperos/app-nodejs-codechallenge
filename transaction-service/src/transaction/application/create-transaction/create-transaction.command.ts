import { ICommand } from "@nestjs/cqrs";

export interface CreateTransactionDTO {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionTypeId: number;
  value: number;
}

export class CreateTransactionCommand implements ICommand {
  constructor(public readonly createTransactionDTO: CreateTransactionDTO) {}
}
