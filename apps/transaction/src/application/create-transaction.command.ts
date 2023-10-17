import { CreateTransactionInput } from '../infraestructure/dto/create-transaction.input';

export class CreateTransactionCommand {
  constructor(public readonly createTransactionInput: CreateTransactionInput) { }
}