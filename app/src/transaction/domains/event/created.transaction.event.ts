import { IEvent } from '@nestjs/cqrs';

export class CreatedTransactionEvent implements IEvent {
  constructor(readonly id:string,readonly accountExternalIdDebit: string,readonly  accountExternalIdCredit: string, readonly tranferTypeId:number, readonly value: number) {}
}
