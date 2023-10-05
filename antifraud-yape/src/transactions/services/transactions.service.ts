import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository:Repository<Transaction>
){}

  async updateStatusTransaction(idTransaction: number) {
    const transaction = await this.getTransactionById(idTransaction);

    const updateStatus = Number(transaction.status) < 1000 ? 'approved' : 'rejected' ;

    if (!transaction) {
      throw new console.error("transaction not found");                 
  }
    
    this.transactionRepository.save({
      ...transaction,
      status: updateStatus,
    })
  }

  public getTransactionById(transactionId:number) {
    return this.getAccountsBaseQuery()
        .andWhere('acc.accountId = :accountId', {transactionId})
        .getOne();
}

  private getAccountsBaseQuery() {
    return this.transactionRepository
    .createQueryBuilder('tx')        
    .orderBy('tx.transactionId','ASC');
}



}
