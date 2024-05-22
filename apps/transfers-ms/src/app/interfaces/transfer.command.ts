import { ITransfer } from './transfer.interface';

export class TransferCommand implements ITransfer {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;

  constructor(props: ITransfer) {
    this.accountExternalIdDebit = props.accountExternalIdDebit;
    this.accountExternalIdCredit = props.accountExternalIdCredit;
    this.transferTypeId = Number(props.transferTypeId);
    this.value = Number(props.value);
  }
}
