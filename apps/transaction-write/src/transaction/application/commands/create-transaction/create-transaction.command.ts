import { CreateTransactionRequest } from '../../dtos/create-transaction.dto';

export class CreateTransactionCommand {
  constructor(
    public readonly createTransactionRequest: CreateTransactionRequest,
  ) {}
}
