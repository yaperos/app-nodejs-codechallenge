import { Query } from '../../domain/query';
import { Response } from '../../domain/response';
import { QueryBus } from '../../domain/queryBus';
import { QueryHandlers } from './queryHandlers';

export class InMemoryQueryBus implements QueryBus {
	constructor(private readonly queryHandlersInformation: QueryHandlers) {}

	async ask<R extends Response>(query: Query): Promise<R> {
		const handler = this.queryHandlersInformation.get(query);

		return (await handler.handle(query)) as Promise<R>;
	}
}
