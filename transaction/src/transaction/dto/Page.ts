import { ApiProperty } from '@nestjs/swagger';

export default class Page<T> {
	@ApiProperty()
	public result: T[];

	@ApiProperty()
	public totalTransactions: number;

	public constructor(results: T[], countAll: number) {
		this.result = results;
		this.totalTransactions = Math.ceil(countAll);
	}

	public static create<T>(results: T[], countAll: number): Page<T> {
		return new Page<T>(results, countAll);
	}
}
