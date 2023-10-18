import { CreateTransactionDto } from '../../infraestructure/dto/create-transaction.dto';

export class CreateTransactionCommand {
  constructor(public readonly createTransactionDto: CreateTransactionDto) { }
}