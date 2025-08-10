import { ValidatedTransactionRequestDto } from '../../dtos';

export class UpdateTransactionStatusCommand {
  constructor(public readonly payload: ValidatedTransactionRequestDto) {}
}
