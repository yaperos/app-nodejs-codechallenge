import { TransactionModel } from "@payments/shared/model";
import { ILogger } from "../domain/logger/logger.interface";
import { ITransactionRepository } from "../domain/repositories/transaction.repository.interface";

export class GetTransactionUseCases{

    constructor(private readonly logger: ILogger, private readonly transactionRepository: ITransactionRepository){}

    async execute(externalId: string): Promise<TransactionModel>{
        const result = await this.transactionRepository.findByExternalId(externalId);
        this.logger.log('getTransactionUseCases execute', `Transaction with id ${externalId} has been recovered`);
        return result;
    }

}