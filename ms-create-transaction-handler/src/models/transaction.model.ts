import { CreateTransactionDto } from './dto/create-transaction.dto';

export class Transaction extends CreateTransactionDto {
  _id: string;
}
