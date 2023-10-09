import { Query } from './query';
import { Response } from './response';

export interface QueryBus {
	ask<R extends Response>(query: Query): Promise<R>;
}
