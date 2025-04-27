import { ICommand } from "@nestjs/cqrs";

export interface NewTransactionDTO {
  id: string;
  value: number;
}

export class ValidateTransactionCommand implements ICommand {
  constructor(public readonly TransactionDTO: NewTransactionDTO) {}
}
