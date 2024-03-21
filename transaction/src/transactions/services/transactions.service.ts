import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { TransactionStatusCodeEnum, UpdateTransaction } from '../../types';
import { Transaction, TransactionStatus, TransactionType } from '../../models';
import { TRANSACTION_SERVICE, VALIDATE_TRANSACTION } from '../../constants';
import { CreateTransactionInput } from '../inputs';

@Injectable()
export class TransactionsService {
    constructor(         
        @Inject(TRANSACTION_SERVICE) private readonly clientKafka: ClientKafka,
        @InjectRepository(TransactionStatus) private readonly transactionStatus: Repository<TransactionStatus>,       
        @InjectRepository(TransactionType) private readonly transactionType: Repository<TransactionType>,        
        @InjectRepository(Transaction) private readonly transaction: Repository<Transaction>
    ) { }

    async getTransactions(): Promise<Transaction[]> {
        try {
            return await this.transaction.find();
        } catch (error) {            
            throw new InternalServerErrorException(error)
        }
    }
    
    async getTransactionByID(id: string): Promise<Transaction> {
        try {
            return await this.transaction.findOne({ where: { transactionExternalId: id }});
        } catch (error) {            
            throw new InternalServerErrorException(error)
        }
    }

    async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
        try {
            const transactionType = await this.transactionType.findOne({ where: {id: input.transactionTypeId }});
            if (!transactionType) {
                throw new NotFoundException('Transaction type not found')
            }
            
            const transactionStatus = await this.transactionStatus.findOne({ where: { code: TransactionStatusCodeEnum.PENDING } })
            if (!transactionStatus) {
                throw new NotFoundException('Transaction status not found')
            }            
            const newTransaction = await this.transaction.create({
                transactionStatus,
                transactionType,
                ... input,
                
            })
            const transactionCreated: Transaction = await this.transaction.save(newTransaction);
            this.clientKafka.emit(VALIDATE_TRANSACTION, JSON.stringify({
                id: transactionCreated.transactionExternalId,
                value: transactionCreated.value,
            }));
            return transactionCreated
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async updateTransaction(payload: UpdateTransaction): Promise<void> {
        try {
            const transactionStatus = await this.transactionStatus.findOne({ where: { code: payload.code } })
            if (!transactionStatus) {
                throw new NotFoundException('Transaction status not found')
            }
            const transaction = await this.transaction.findOne({ where: { transactionExternalId: payload.id }});
            if (!transaction) {
                throw new NotFoundException('Transaction not found')
            }
            transaction.transactionStatus = transactionStatus;
            await this.transaction.save(transaction)     
        } catch (error) {            
            throw new InternalServerErrorException(error)
        }
    }
}
