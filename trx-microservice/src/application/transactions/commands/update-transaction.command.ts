import { ICommand } from '@nestjs/cqrs';

export class UpdateTransactionCommand implements ICommand {
  constructor(
    public readonly transactionExternalId: string,
    public readonly status: 'APPROVED' | 'REJECTED',
  ) {}
}