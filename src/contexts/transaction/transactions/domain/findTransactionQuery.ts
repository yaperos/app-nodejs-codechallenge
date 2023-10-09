import { Query } from '../../../shared/domain/query';

export class FindTransactionQuery implements Query {
	readonly id: string;

	constructor(id: string) {
		this.id = id;
	}
}
