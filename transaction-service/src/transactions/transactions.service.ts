import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from './dtos/transaction.dto';
import { Transaction } from 'src/entities/transaction.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionCreatedEvent } from './dtos/transaction-created-event';
import { RetrieveTransaction } from './dtos/retrieve-transaction.dto';

@Injectable()
export class TransactionsService implements OnModuleInit{
    constructor(
        @Inject('ANTIFRAUD_SERVICE')
        private readonly antifraudServiceClient: ClientKafka,
        @InjectRepository(Transaction)
        private transactionRepostory: Repository<Transaction>,
        ) {}
        
        async createTransaction(transaction: TransactionDto)/*: Promise<RetrieveTransaction>*/ {
            const newTransaction = await this.transactionRepostory.create(
                { ...transaction, 
                    value: transaction.valueTransaction 
                });
            
            const savedTransaction = await this.transactionRepostory.save(newTransaction);
            
            if(savedTransaction){                
                const resp = this.antifraudServiceClient.send('transaction_created', new TransactionCreatedEvent(
                    savedTransaction.transactionId,
                    transaction.accountExternalIdDebit,
                    transaction.accountExternalIdCredit,
                    transaction.transferTypeId,
                    transaction.valueTransaction
                ));

                resp.subscribe( async (response: RetrieveTransaction) => {
                    console.log("Response from antifraud ----> ", response);
                    await this.updateTransaction(savedTransaction.transactionId, response.transactionStatus.name.toString());
                    return response;
                });
                
                console.log("🚀 ~ TransactionsService ~ resp.subscribe ~ resp:", resp);
                return resp;
            } 

            throw new HttpException('Error trying to save transaction', HttpStatus.BAD_REQUEST);
        }

        onModuleInit() {
            this.antifraudServiceClient.subscribeToResponseOf('transaction_created');
        }

        async get() {
            return await this.transactionRepostory.find();
        }


        async updateTransaction(transactionId: string, status: string){
            const transaction = this.transactionRepostory.findOneBy({transactionId})

            if(transaction) {
                const transactionUpdate = await this.transactionRepostory.update(transactionId, {status});
                console.log("🚀 ~ TransactionsService ~ updateTransaction ~ transactionUpdate:", transactionUpdate)
                return transactionUpdate;
            }

            throw new HttpException('Transaction not exist', HttpStatus.BAD_REQUEST);
        }

}
