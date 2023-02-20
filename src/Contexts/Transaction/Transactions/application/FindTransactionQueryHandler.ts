import { Query } from '../../../Shared/domain/Query';
import { QueryHandler } from '../../../Shared/domain/QueryHandler';
import { FindTransactionQuery } from '../domain/FindTransactionQuery';
import { TransactionId } from '../domain/TransactionId';
import { TransactionFinder } from './TransactionFinder';
import { TransactionResponse } from './TransactionResponse';

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
