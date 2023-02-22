import { Inject, Injectable } from '@nestjs/common';
import { DataCreated } from '../../common/models/transaction-created.event';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../common/entities/transaction.entity';
import { ConfigService } from '@nestjs/config';
import { TRANSACTION_STATUS } from 'src/common/util/util.common';
import axios from 'axios';

@Injectable()
export class TransactionService {
  constructor(@InjectRepository(Transaction) private transactionRepo: Repository<Transaction>) {}
 
  @Inject(ConfigService)
  public config: ConfigService;

  async handleTransactionCreated(transaccionEvent: DataCreated) {
    console.log('order...... ', transaccionEvent);


    const result = await this.transactionRepo.findOne({where: {transactionExternalId: transaccionEvent.transactionExternalId}})

    transaccionEvent.transactionStatus=TRANSACTION_STATUS.PENDING.id;

    console.log(result);
    if(result ===null || Object.keys(result).length === 0){
      const newTransaction = this.transactionRepo.create(transaccionEvent);
      this.transactionRepo.save(newTransaction);
      this.callAntifraudTopic(transaccionEvent.transactionExternalId)
    }
    else{
      this.transactionRepo.merge(result, transaccionEvent);
      this.transactionRepo.save(result);
      this.callAntifraudTopic(transaccionEvent.transactionExternalId)
    }
  }


  async callAntifraudTopic(transactionId: any){
    //CALL TOPIC ANTIFRAUD AXIOS
    try {
      console.log('Antifraud Call')
      console.log(process.env.ANTIFRAUD_URL)
      const recurring = await axios.post(
        process.env.ANTIFRAUD_URL,
        {transactionExternalId: transactionId},
      );
    } catch (err) {
      console.log('antifraud event failed', err);
    }
  }
}
