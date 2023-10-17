import { Injectable } from '@nestjs/common';
import { InjectRepository,} from '@nestjs/typeorm';
import { CreateTransactionStatusInput } from './dto/create-transaction-status.input';
import { UpdateTransactionStatusInput } from './dto/update-transaction-status.input';
import { TransactionStatus} from 'src/transaction-status/entities/transaction-status.entity'
import { Repository,} from 'typeorm';

@Injectable()
export class TransactionStatusService {

  constructor(@InjectRepository(TransactionStatus) private transactionStatusRepository:Repository<TransactionStatus> ){};


  create(createTransactionStatusInput: CreateTransactionStatusInput):Promise<TransactionStatus>{

    const transactionStatus = this.transactionStatusRepository.create(createTransactionStatusInput);
    return this.transactionStatusRepository.save(transactionStatus);
  }

  findAll():Promise<TransactionStatus[]> {
    return this.transactionStatusRepository.find();
  }

  findOneById(id: number):Promise<TransactionStatus>{
    return this.transactionStatusRepository.findOne({
      where:{
        id,
      }
    });
  }

  findOneByName(name: string) {
    return this.transactionStatusRepository.findOne({
      where:{
        name,
      }
    });
  }
}
