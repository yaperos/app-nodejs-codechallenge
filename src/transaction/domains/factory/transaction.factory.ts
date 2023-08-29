import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { ITransactionModel, TransactionModel, TransactionProperties } from '../model/transaction.model';

//import { TransactionModel, AccountImplement, AccountProperties} from 'src/account/domain/Account';

type CreateTransactionOptions = Readonly<{
    accountExternalIdDebit: string;   
    accountExternalIdCredit: string;
    tranferTypeId:number;
    value: number;
}>;

export class TransactionFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateTransactionOptions): ITransactionModel {
    const model =new TransactionModel({...options});
    // con esto el objeto model del tipo TransactionModel ahora podra publicar eventos
    const m = this.eventPublisher.mergeObjectContext(model);
    return m;
  }

  reconstitute(properties: TransactionProperties): ITransactionModel {
    return this.eventPublisher.mergeObjectContext(
      new TransactionModel(properties),
    );
  }
}
