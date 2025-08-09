import { TransactionRequestDto } from '../../dtos/transaction.dto';

export class ValidateTransactionCommand {
  constructor(public readonly payload: TransactionRequestDto) {}
}
