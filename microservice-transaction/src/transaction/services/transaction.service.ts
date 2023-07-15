import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from '../entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransaction } from '../structure/interfaces/CreateTransaction';
import { TransactionStatus } from '../structure/enums/transaction.status';

@Injectable()
export class TransactionService {

    constructor(
        @Inject('ANTI_FRAUD_MS') private readonly clientKafka: ClientKafka,
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>
    ){}

    async create(data: CreateTransaction){
        
        const transaction = new Transaction()
        transaction.accountExternalIdCredit = data.accountExternalIdCredit;
        transaction.accountExternalIdDebit = data.accountExternalIdDebit;
        transaction.transferTypeId = data.transferTypeId;
        transaction.value = data.value;
        transaction.createdAt = new Date();

        const { id, value } = await this.transactionRepository.save(transaction);

        this.clientKafka.emit('transaction-created',JSON.stringify({...transaction, id, value}))

        return {status: 'ok', data: {...transaction, id}}
    }

    findOneById(id: number) {
        return this.transactionRepository.findOneBy({ id });
    }

    findAll() {
        return this.transactionRepository.find();
    }

    async getTransactionUpdated(data:any){
        const transaction = await this.findOneById(data.id);

        if(data.transactionStatus.name === 'APPROVED'){
            transaction.transactionStatus = TransactionStatus.APPROVED
        }else if(data.transactionStatus.name === 'REJECTED'){
            transaction.transactionStatus = TransactionStatus.REJECTED
        }else{
            transaction.transactionStatus = TransactionStatus.PENDING
        }

        Logger.log('Validado!')

        return this.transactionRepository.save(transaction);
    }
}
