import { Query } from '../../../shared/domain/query';
import { QueryHandler } from '../../../shared/domain/queryHandler';
import { FindTransactionQuery } from '../domain/findTransactionQuery';
import { TransactionId } from '../domain/transactionId';
import { TransactionFinder } from './transactionFinder';
import { TransactionResponse } from './transactionResponse';

export class FindTransactionQueryHandler
	implements QueryHandler<FindTransactionQuery, TransactionResponse>
{
	constructor(private readonly transactionFinder: TransactionFinder) {}

	subscribedTo(): Query {
		return FindTransactionQuery;
	}

	async handle(_query: FindTransactionQuery): Promise<TransactionResponse> {
		const id = new TransactionId(_query.id);

		return new TransactionResponse(await this.transactionFinder.run({ id }));
	}
}
