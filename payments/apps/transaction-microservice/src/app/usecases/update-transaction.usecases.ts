import { UpdateTransactionDto } from "@payments/shared/dto";
import { TransactionModel } from "@payments/shared/model";
import { ILogger } from "../domain/logger/logger.interface";
import { ITransactionRepository } from "../domain/repositories/transaction.repository.interface";
import TransactionMapper from "../infrastructure/mappers/transaction.mapper";

export class UpdateTransactionUseCases{
    constructor(
        private readonly logger: ILogger,
        private readonly transactionRepository: ITransactionRepository){}

    async execute(transactionDto: UpdateTransactionDto): Promise<TransactionModel>{
        const transactionModel = TransactionMapper.toTransactionModelFromUpdateTransactionDto(transactionDto);
        const result = await this.transactionRepository.update(transactionModel);
        this.logger.log('updateTransactionUseCases execute', `Transaction with id ${transactionDto.externalId} has been updated to status ${transactionDto.status}`);
        return result;
    }
}