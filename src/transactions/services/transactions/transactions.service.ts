import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRequest } from 'src/models/transaction.request';
import { TransactionStatus } from 'src/models/transaction.response';
import { Transaction } from 'src/typeorm/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
    
   

    constructor(
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
      ) {}

      createTransaction(transaction : Transaction){
        const newTransaction = this.transactionRepository.create(transaction);
        return this.transactionRepository.save(newTransaction);
      }

      async approve(newTransac: Transaction) {
        let transac =await  this.transactionRepository.findOneBy({id:newTransac.id})
        transac.transactionStatus = TransactionStatus.APPROVED;
        return await this.transactionRepository.save(transac);
      }

      async reject(newTransac: Transaction) {
        let transac =await  this.transactionRepository.findOneBy({id:newTransac.id})
        transac.transactionStatus = TransactionStatus.REJECTED;
        return await this.transactionRepository.save(transac);
      }

      findById(idFind:number){
        return this.transactionRepository.findOne({where:{id:idFind}});
      }
      getAll() {
        return this.transactionRepository.find();
      }
}
