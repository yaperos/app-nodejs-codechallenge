import { Injectable } from '@nestjs/common';
import uuid = require('uuid');
import { Transaction } from './transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionStatus } from 'src/transaction-status/transaction-status.entity';
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
    newTransaction.transactionStatusID = "2";
 
    var status: TransactionStatus = new TransactionStatus();
    status.id = "2";
    status.name = "Debito";


    newTransaction.transactionStatus = status;
    return this.transactionsRepository.save(newTransaction);
  }

  async getTransactionStatus(id:string): Promise<TransactionStatus>
  {
    return this.transactionstatusService.findOne(id);
  }
}
