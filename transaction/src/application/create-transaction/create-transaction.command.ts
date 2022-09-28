import { ICommand } from '@nestjs/cqrs';

export class CreateTransactionCommand implements ICommand {
  constructor(
    readonly accountExternalIdDebit: string,
    readonly accountExternalIdCredit: string,
    readonly tranferTypeId: number,
    readonly value: number,
  ) {}
}
