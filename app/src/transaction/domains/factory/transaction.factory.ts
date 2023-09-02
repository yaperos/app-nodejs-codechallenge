import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { ITransactionModel, TransactionModel, TransactionProperties } from '../model/transaction.model';
//import { Status } from 'src/transaction/infraestructures/entities/status';

//import { TransactionModel, AccountImplement, AccountProperties} from 'src/account/domain/Account';

type CreateTransactionOptions = Readonly<{
    accountExternalIdDebit: string;   
    accountExternalIdCredit: string;
    tranferTypeId:number;
    value: number;  
  //  status:Status;  
}>;


export class TransactionFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  
  create(options: CreateTransactionOptions): ITransactionModel {
    console.log("paso factory");
    const model =new TransactionModel({...options});
    // con esto el objeto model del tipo TransactionModel ahora podra publicar eventos
    const m = this.eventPublisher.mergeObjectContext(model);
    return m;
  }

  reconstitute(properties: TransactionProperties): ITransactionModel {
    console.log("paso factory 2");
    return this.eventPublisher.mergeObjectContext(
      new TransactionModel(properties),
    );
  }
}
