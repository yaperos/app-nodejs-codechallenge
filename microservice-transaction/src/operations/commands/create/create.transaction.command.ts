import { AutoMap } from '@automapper/classes';
import { ICommand } from '@nestjs/cqrs';


export class CreateTransactionCommand implements ICommand {
  @AutoMap()
  readonly accountExternalIdDebit: string;

  @AutoMap()
  readonly accountExternalIdCredit: string;

  @AutoMap()
  readonly tranferTypeId: number;

  @AutoMap()
  readonly value: number;
}

