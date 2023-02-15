import { Injectable } from '@nestjs/common';
import uuid = require('uuid');
import { Transaction } from './transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionStatus } from 'src/transaction-status/transaction-status.entity';
import { TransactionType } from 'src/transaction-type/transaction-type.entity';

import { TransactionStatusService } from 'src/transaction-status/transaction-status.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private transactionstatusService: TransactionStatusService
  ) {}

  async create() {
    console.log('create service');
    let uuidv4: string = uuid.v4();
    console.log(uuidv4);
  }

  async findAll(): Promise<Transaction[]> {
    const transations = await this.transactionsRepository.find(); 
    return transations;
  }

  createTransaction(transacion: CreateTransactionInput): Promise<Transaction> {
    const newTransaction = this.transactionsRepository.create(transacion);
    newTransaction.createdAt = new Date();
  
 
    var status: TransactionStatus = new TransactionStatus();
    status.id = "1";
    status.name = "Pending";
    newTransaction.transactionStatus = status;

    var type: TransactionType = new TransactionType();
    type.id = "1";
    type.name = "Debito";
    newTransaction.transactionType = type;


    return this.transactionsRepository.save(newTransaction);
  }

  async getTransactionStatus(id:string): Promise<TransactionStatus>
  {
    return this.transactionstatusService.findOne(id);
  }
}
