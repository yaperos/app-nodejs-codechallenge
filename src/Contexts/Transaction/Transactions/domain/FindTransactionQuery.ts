import { Query } from '../../../Shared/domain/Query';

export class FindTransactionQuery implements Query {
	readonly id: string;

	constructor(id: string) {
		this.id = id;
	}
}
