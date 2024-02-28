import { Inject, Injectable } from "@nestjs/common";
import { DatabaseBankingTransactionRepository } from "../repositories/banking-transaction.repository";
import { CreateBankingTransactionInput } from "src/domain/models/inputs/create-banking-transaction";
import { LoggerService } from "../logger/logger.service";
import { BankingTransaction } from "../entities/banking-transaction.entity";
import { UpdateBankingTransactionInput } from "src/domain/models/inputs/update-banking-transaction";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class BankingTransactionService {
    
    constructor(
        private readonly bankingTransactionRepository: DatabaseBankingTransactionRepository,
        private readonly logger: LoggerService,
        @Inject('KAFKA')
        private readonly kafka: ClientProxy
        ){}

    async saveTransaction(createdTransaction: CreateBankingTransactionInput): Promise<BankingTransaction>{
        try{
            const result = await this.bankingTransactionRepository.save(createdTransaction);
            this.logger.log('create result', JSON.stringify(result))

            this.logger.log(BankingTransactionService.name,'sending to antifraud microservice')
            this.kafka.emit('created.event',{createdTransaction: {
                transactionExternalId: result.transactionExternalId,
                value: result.value
            }});

            return result;
        }catch(error){
            this.logger.log('Somethin wrong','error, check exception')
        }
    }

    async updateTransaction(updateTransaction: UpdateBankingTransactionInput): Promise<BankingTransaction> {
        try{
            const result = await this.bankingTransactionRepository.update(updateTransaction);
            this.logger.log('update result', JSON.stringify(result))
            return result;
        }catch(error){
            this.logger.log('Somethin wrong','error, check exception')
            this.logger.error('error',error.message)
        }
    }
}