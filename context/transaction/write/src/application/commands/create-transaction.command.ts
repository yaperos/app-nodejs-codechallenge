import { CreateTransactionDto } from "../../infrastructure/dto/create-transaction.dto";

export class CreateTransactionCommand {
  constructor(public readonly createTransactionDto: CreateTransactionDto) {}
}
