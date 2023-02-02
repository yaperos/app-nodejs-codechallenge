import { CreateTransactionDto } from "@payments/shared/dto";
import { TransactionModel } from "@payments/shared/model";
import { ILogger } from "../domain/logger/logger.interface";
import { ITransactionRepository } from "../domain/repositories/transaction.repository.interface";
import TransactionMapper from "../infrastructure/mappers/transaction.mapper";

export class CreateTransactionUseCases{
    constructor(private readonly logger: ILogger, private readonly transactionRepository: ITransactionRepository){}

    async execute(transaction: CreateTransactionDto): Promise<TransactionModel>{
        const transactionModel = TransactionMapper.toTransactionModelFromCreateTransactionDto(transaction);
        const result = await this.transactionRepository.insert(transactionModel);
        this.logger.log('createTransactionUseCases execute', 'New transaction have been created');
        return result;
    }
}