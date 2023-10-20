import { HttpCode, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository} from "@nestjs/typeorm"

import { KafkaSender } from '../../../core-library/src/sender/kafka.sender';
import { Repository } from "typeorm";
import { CreateTransactionRequestDto } from "../common/dtos/request/create-transaction.dto";
import { Transaction } from "../domain/model/transaction.model";
import { Status } from "../common/constants/status.constant";
import { KafkaConstants } from "../../../core-library/src/common/constants/kafka.constant";
import { TransactionResponse } from "../common/dtos/response/transaction.response.dto";
import {v4 as uuidv4} from 'uuid'

@Injectable()
export class TransactionService{

    @Inject()
    private logger: Logger;

    constructor(
        @InjectRepository(Transaction)
        private transactionRepository : Repository<Transaction>,
        private readonly kafkaSender: KafkaSender
    ){}

    async create( request: CreateTransactionRequestDto) : Promise<TransactionResponse>{
        try {
            const transactionToSave = this.buildTransaction(request);
            const transaction = await this.transactionRepository.save(transactionToSave);
            this.logger.log(`Transaction created: ${JSON.stringify(transaction)}`);
            const message = {
                id: transaction.id,
                value: transaction.value
            }
            await this.kafkaSender.sendMessageToTopic(message, KafkaConstants.Fraud.REQUEST_TOPIC);

            return this.buildResponse(transaction);

        } catch (error) {
            this.logger.error(`Fail to create transacion: ${JSON.stringify(request)}`);
            throw new Error(error);
        }    
    }

    async update(request: any) : Promise<TransactionResponse>{
        const fraudResponse = request.message;
        try {
            const transaction = await this.transactionRepository.findOneBy({id:fraudResponse.id});
    
            if (transaction) {
                transaction.status = fraudResponse.status.toString();
                transaction.updatedAt = new Date();
                const updatedTransaction = await this.transactionRepository.save(transaction);
                this.logger.log(`Transaction updated: ${JSON.stringify(updatedTransaction)}`);
                return this.buildResponse(updatedTransaction);
            } else {
                this.logger.error(`Transaction with ID ${fraudResponse.id} not found`);
            }
        } catch (error) {
            this.logger.error(`Fail to update transaction with ID: ${fraudResponse.id}`);
        }
    }

    async retrieve(id:string) : Promise<TransactionResponse>{
        try {
            const transaction = await this.transactionRepository.findOneBy({transactionExternalId:id});
    
            if(transaction){
                return this.buildResponse(transaction);
            }else{
                throw new Error(`Transaction with id: ${id} not found`)
            }
        } catch (error) {
            this.logger.error(`Fail to retrieve transaction with ID: ${id}`);
            throw error;
        }   
    }

    private buildTransaction(request: CreateTransactionRequestDto) : Transaction {
        const id = uuidv4();
        console.log(`External_id: ${id}`);
        const transactionToSave = new Transaction();
            transactionToSave.transactionExternalId = id;
            transactionToSave.accountExternalIdCredit = request.accountExternalIdCredit;
            transactionToSave.accountExternalIdDebit = request.accountExternalIdDebit;
            transactionToSave.tranferTypeId = request.tranferTypeId;
            transactionToSave.value = request.value;
            transactionToSave.status = Status.PENDING;
            return transactionToSave;
    }

    private buildResponse(transaction :Transaction) : TransactionResponse{
        const response = new TransactionResponse();
        response.transactionExternalId = transaction.transactionExternalId;
        response.transactionType = transaction.tranferTypeId.toString();
        response.transactionStatus = transaction.status;
        response.value = transaction.value;
        response.createdAt = transaction.createdAt;

        return response;
    }
    
}