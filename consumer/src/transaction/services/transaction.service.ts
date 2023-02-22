import { Inject, Injectable } from '@nestjs/common';
import { DataCreated } from '../../common/models/transaction-created.event';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {Transaction} from '../../common/entities/transaction.entity';
import { ConfigService } from '@nestjs/config';
import { TRANSACTION_STATUS } from 'src/common/util/util.common';

@Injectable()
export class TransactionService {
  constructor(@InjectRepository(Transaction) private transactionRepo: Repository<Transaction>) {}
 
  @Inject(ConfigService)
  public config: ConfigService;

  async handleTransactionCreated(transaccionEvent: DataCreated) {
    console.log('order...... ', transaccionEvent);


    const result = await this.transactionRepo.findOne({where: {transactionExternalId: transaccionEvent.transactionExternalId}})
    
    const maximo: number = this.config.get('MAXIMO_VALOR_PERMITIDO');

    if(transaccionEvent.valueTx>maximo){
      console.log("el valor es mayor al esperado");
      transaccionEvent.transactionStatus=TRANSACTION_STATUS.REJECTED.id;
    }
    else{
      console.log("el valor es menor permitido");
    }

    console.log(result);
    if(result ===null || Object.keys(result).length === 0){
      const newTransaction = this.transactionRepo.create(transaccionEvent);
      return this.transactionRepo.save(newTransaction);
    }
    else{
      this.transactionRepo.merge(result, transaccionEvent);
      this.transactionRepo.save(result);
    }
     
  }
}
