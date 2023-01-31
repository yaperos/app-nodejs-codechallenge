import { ILogger } from "src/domain/logger/logger.interface";
import { TransactionModel } from "src/domain/model/transaction.model";
import { ITransactionRepository } from "src/domain/repositories/transaction.repository.interface";

export class GetTransactionUseCases{

    constructor(private readonly logger: ILogger, private readonly transactionRepository: ITransactionRepository){}

    async execute(externalId: string): Promise<TransactionModel>{
        const result = await this.transactionRepository.findByExternalId(externalId);
        this.logger.log('getTransactionUseCases execute', 'Transaction has been recovered');
        return result;
    }

}