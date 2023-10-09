import { Command } from '../../../shared/domain/command';

type Params = {
	accountExternalIdDebit: string;
	accountExternalIdCredit: string;
	tranferTypeId: number;
	value: number;
};

export class CreateTransactionCommand extends Command {
	accountExternalIdDebit: string;
	accountExternalIdCredit: string;
	tranferTypeId: number;
	value: number;

	constructor({ accountExternalIdCredit, accountExternalIdDebit, tranferTypeId, value }: Params) {
		super();
		this.accountExternalIdDebit = accountExternalIdDebit;
		this.accountExternalIdCredit = accountExternalIdCredit;
		this.tranferTypeId = tranferTypeId;
		this.value = value;
	}
}
