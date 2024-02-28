import { Injectable } from "@nestjs/common";
import { DatabaseBankingTransactionRepository } from "../repositories/banking-transaction.repository";
import { CreateBankingTransactionInput } from "src/domain/models/inputs/create-banking-transaction";
import { LoggerService } from "../logger/logger.service";
import { BankingTransaction } from "../entities/banking-transaction.entity";
import { UpdateBankingTransactionInput } from "src/domain/models/inputs/update-banking-transaction";

@Injectable()
export class BankingTransactionService {
    
    constructor(
        private readonly bankingTransactionRepository: DatabaseBankingTransactionRepository,
        private readonly logger: LoggerService
        ){}

    async saveTransaction(createTransaction: CreateBankingTransactionInput): Promise<BankingTransaction>{
        try{
            const result = await this.bankingTransactionRepository.save(createTransaction);
            this.logger.log('resultado', JSON.stringify(result))
            return result;
        }catch(error){
            this.logger.log('Somethin wrong','error, check exception')
        }
    }

    async updateTransaction(updateTransaction: UpdateBankingTransactionInput): Promise<BankingTransaction> {
        try{
            const result = await this.bankingTransactionRepository.update(updateTransaction);
            this.logger.log('resultado', JSON.stringify(result))
            return result;
        }catch(error){
            this.logger.log('Somethin wrong','error, check exception')
            this.logger.error('error',error.message)
        }
    }
}