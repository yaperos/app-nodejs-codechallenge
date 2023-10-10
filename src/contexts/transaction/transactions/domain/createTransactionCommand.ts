import { Command } from '../../../shared/domain/command';

type Params = {
  id: string;
	accountExternalIdDebit: string;
	accountExternalIdCredit: string;
	tranferTypeId: number;
	value: number;
};

export class CreateTransactionCommand extends Command {
  id: string;
	accountExternalIdDebit: string;
	accountExternalIdCredit: string;
	tranferTypeId: number;
	value: number;

	constructor({ accountExternalIdCredit, accountExternalIdDebit, tranferTypeId, value, id }: Params) {
		super();
    this.id = id;
		this.accountExternalIdDebit = accountExternalIdDebit;
		this.accountExternalIdCredit = accountExternalIdCredit;
		this.tranferTypeId = tranferTypeId;
		this.value = value;
	}
}
