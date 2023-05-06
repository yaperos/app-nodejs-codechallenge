import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionQuery } from '../get-transaction.query';
import { plainToClass } from 'class-transformer';
import { TransactionModel } from '../../models/transaction.model';
import { TransactionRepository } from 'src/transactions/repositories/transaction.repository';
import { EventBusService } from 'src/config/events/event-bus.service';

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler
    implements IQueryHandler<GetTransactionQuery>
{
    constructor(private repository: TransactionRepository, private eventBusService: EventBusService) { }

    async execute(query: GetTransactionQuery): Promise<any> {
        const transaction = await this.repository.getTransaction({
            id: query.transactionExternalId,
        });
        return plainToClass(TransactionModel, transaction);
    }
}