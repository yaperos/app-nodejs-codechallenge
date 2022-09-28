import { ICommand } from '@nestjs/cqrs';

export class UpdateStatusTransactionCommand implements ICommand {
  constructor(readonly id: string, readonly transactionStatus: number, readonly value: number) {}
}
