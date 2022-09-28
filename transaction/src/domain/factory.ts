import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { TransactionInterface, TransactionImplement, TransactionProperties, STATUS_TYPE } from './transaction';

export class TransactionFactory {
  constructor(@Inject(EventPublisher) private readonly eventPublisher: EventPublisher) {}

  create(
    id: string,
    transactionStatus: STATUS_TYPE,
    accountExternalIdDebit: string,
    accountExternalIdCredit: string,
    tranferTypeId: number,
    value: number,
  ): TransactionInterface {
    return this.eventPublisher.mergeObjectContext(
      new TransactionImplement({
        id,
        accountExternalIdDebit,
        accountExternalIdCredit,
        tranferTypeId,
        value,
        transactionStatus,
      }),
    );
  }

  reconstitute(properties: TransactionProperties): TransactionInterface {
    return this.eventPublisher.mergeObjectContext(new TransactionImplement(properties));
  }
}
