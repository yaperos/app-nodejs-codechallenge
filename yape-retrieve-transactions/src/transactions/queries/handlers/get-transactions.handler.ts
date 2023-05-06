import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionsQuery } from '../get-transactions.query';
import { plainToClass } from 'class-transformer';
import { TransactionModel } from '../../models/transaction.model';
import { TransactionRepository } from 'src/transactions/repositories/transaction.repository';

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsHandler
    implements IQueryHandler<GetTransactionsQuery>
{
    constructor(private repository: TransactionRepository) { }

    async execute(query: GetTransactionsQuery): Promise<any> {
        return (await this.repository.getTransactions({})).map((transaction) => {
            const res = plainToClass(TransactionModel, transaction);
            console.log(res);
            return res;
        });
    }
}