import { Injectable } from '@nestjs/common';
import { TransactionProducer } from './TransactionProducer';
import { TransactionInputDto } from '../dtos/TransactionInputDto';
import { TransactionEntity } from 'src/entities/transaction.entity';
import { TransactionService } from 'src/services/transaction.service';
import { Guid } from 'guid-typescript';

@Injectable()
export class TransactionProducerService {
 
  constructor(
    private readonly producerService :TransactionProducer,
    private readonly transactionService :TransactionService,
    )
    {}
  async  saveTransaction(transaction: TransactionInputDto) {
  
    let item = <TransactionEntity>{
      transactionExternalId: Guid.create().toString(),
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      tranferTypeId: transaction.tranferTypeId,
      transactionStatus: 'pending',
      value: transaction.value,
      transactionType: "transfer"
    }

    let result = await this.transactionService.create(item);
    item.id = result.id;

    //Send event
    await this.producerService.produce({
      topic:'created-transaction-event',
      messages:[{
        value: JSON.stringify(item)
      }]
    })

    return JSON.stringify(item);
  }
  
}