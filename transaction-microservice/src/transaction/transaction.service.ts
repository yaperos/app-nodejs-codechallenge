import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { InjectRepository,} from '@nestjs/typeorm';
import { Repository,} from 'typeorm';
import { CreateTransactionInput} from './dto/create-transaction.input'
import { UpdateTransactionInput} from './dto/update-transaction.input'
import { TranferTypeService } from 'src/tranfer-type/tranfer-type.service';
import { TransactionStatusService } from 'src/transaction-status/transaction-status.service';
import { TranferType } from 'src/tranfer-type/entities/tranfer-type.entity';
import { TransactionStatus } from 'src/transaction-status/entities/transaction-status.entity';
import { ProducerService } from 'src/kafka/producer/producer.service';
import  {TRANSACTION_STATUS} from 'src/constants/transaction-status'

@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(Transaction)
         private transactionRespository: Repository<Transaction>,
         private tranferTypeService: TranferTypeService,
         private TransactionStatusService: TransactionStatusService,
         private createdTransactionProducer: ProducerService
         ) { }

    
    async findAll(): Promise<Transaction[]> {
        const transactionData = await this.transactionRespository.find()        
        return transactionData;
    }
   
    async findTransactionById(id: number): Promise<Transaction> {
        return this.transactionRespository.findOne({
            where: {
                id,
            }
        });
    }
   
    async createTransaction(transaction:CreateTransactionInput) : Promise<Transaction>{
        const newTransaction = this.transactionRespository.create(transaction);       
        const transactionInf = await this.transactionRespository.save(newTransaction)

        // Send transaction Created event
       if(transactionInf && transactionInf.id){
        this.createdTransactionProducer.produce({
            topic: TRANSACTION_STATUS.PENDING,
            messages: [{ value: JSON.stringify(transactionInf) }],                       
          });
       }
        return transactionInf;
    }

     async update(id: number, updateTransactionInput: UpdateTransactionInput) {
        const transactionData = await this.findTransactionById(id);
        this.transactionRespository.merge(transactionData, updateTransactionInput);
        return this.transactionRespository.save(transactionData);
      }
    
    async getTranferType(tranferTypeId: number): Promise<TranferType> {
        return this.tranferTypeService.findOneById(tranferTypeId);
    }

   
    async getTransactionStatus(transactionStatusId: number): Promise<TransactionStatus> {
        return this.TransactionStatusService.findOneById(transactionStatusId);
    }
}
