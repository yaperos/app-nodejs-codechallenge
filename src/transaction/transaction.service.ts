import { Injectable } from '@nestjs/common';
import uuid = require('uuid');
import { Transaction } from './transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionStatus } from 'src/transaction-status/transaction-status.entity';
import { TransactionType } from 'src/transaction-type/transaction-type.entity';

import { TransactionStatusService } from 'src/transaction-status/transaction-status.service';
import { TransactionTypeService } from 'src/transaction-type/transaction-type.service';
import { UpdateTransactionInput } from './dto/Update-transaction.input';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private transactionStatusServices: TransactionStatusService,
    private transactionTypeServices: TransactionTypeService,
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

    if (newTransaction.value >= 1000)
    {
        newTransaction.transactionStatusID = "3";
    }
    return this.transactionsRepository.save(newTransaction);
  }

  updateTransaction(id:string, updatetransactionInput: UpdateTransactionInput): Promise<Transaction>
  {
    console.log('updateTransaction');
    console.log(updatetransactionInput)
    let editTransaction = this.transactionsRepository.create(updatetransactionInput);
    editTransaction.transactionExternalId = id;
    return this.transactionsRepository.save(editTransaction);

  }

   async getTransactionStatus(id: string): Promise<TransactionStatus> {
    return this.transactionStatusServices.findOne(id);
  }

  async getTransactionType(id: string): Promise<TransactionType> {
    return this.transactionTypeServices.findOne(id);
  }
}
