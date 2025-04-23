import { ICommand } from '@nestjs/cqrs';

export class CreateTransactionCommand implements ICommand {
  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly value: number,
    public readonly transferTypeId: number,
  ) {}
}
