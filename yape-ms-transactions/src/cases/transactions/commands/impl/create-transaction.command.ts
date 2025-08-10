import { CreateTransactionDto } from '../../dtos';

export class CreateTransactionCommand {
  constructor(public readonly payload: CreateTransactionDto) {}
}
