import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DataCreated } from '../../common/models/transaction-created.event';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TRANSACTION_STATUS } from 'src/common/util/util.common';
import {Transaction} from '../../common/entities/transaction.entity';

@Injectable()
export class AntifraudService {
  constructor(
    @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>
  ) {}
 
  @Inject(ConfigService)
  public config: ConfigService;

  async handleAntifraudCheck(transaccionEvent: DataCreated) {
    console.log('order...... ', transaccionEvent);
    
    const result = await this.transactionRepo.findOne({where: {transactionExternalId: transaccionEvent.transactionExternalId}})
    const maximo: number = this.config.get('MAXIMO_VALOR_PERMITIDO');
    //ANTIFRAUD VERIFICATIONS
    if(transaccionEvent.valueTx > maximo){
      console.log("Value greather than 1000");
      transaccionEvent.transactionStatus = TRANSACTION_STATUS.REJECTED.id;
    }
    else{
      transaccionEvent.transactionStatus = TRANSACTION_STATUS.APPROVED.id;
      console.log("Value Accepted");
    }


    if(result === null || Object.keys(result).length === 0){
      console.log("result    >   " , JSON.stringify(result))
    }
    else{
      this.transactionRepo.merge(result, transaccionEvent);
      this.transactionRepo.save(result);
    }


  }
}
