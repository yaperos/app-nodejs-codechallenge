import { ILogger } from "src/domain/logger/logger.interface";
import { TransactionModel } from "src/domain/model/transaction.model";
import { ITransactionRepository } from "src/domain/repositories/transaction.repository.interface";
import { CreateTransactionDto } from "src/infrastructure/controllers/transaction/transaction.dto";
import TransactionMapper from "src/infrastructure/mappers/transaction.mapper";

export class CreateTransactionUseCases{
    constructor(private readonly logger: ILogger, private readonly transactionRepository: ITransactionRepository){}

    async execute(transaction: CreateTransactionDto): Promise<TransactionModel>{
        const transactionModel = TransactionMapper.toTransactionModelFromDto(transaction);
        const result = await this.transactionRepository.insert(transactionModel);
        this.logger.log('createTransactionUseCases execute', 'New transaction have been created');
        return result;
    }
}