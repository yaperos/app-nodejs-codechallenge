import { ICommand } from '@nestjs/cqrs';

export class CreateTransactionCommand implements ICommand {
  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly transferTypeId: number,
    public readonly value: number,
  ) {}
}
