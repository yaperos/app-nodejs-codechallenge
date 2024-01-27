import { Status } from 'src/helper/const.helper';
import { TransactionEntity } from './Transaction.entity';
import { TransactionRequest } from 'src/helper/type.helper';
import { v4 as uuidv4 } from 'uuid';

export class TransactionValue implements TransactionEntity {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: Status;

  constructor(data: TransactionRequest) {
    this.id = uuidv4();
    this.accountExternalIdCredit = data.accountExternalIdCredit;
    this.accountExternalIdDebit = data.accountExternalIdDebit;
    this.tranferTypeId = data.tranferTypeId;
    this.value = data.value;
    this.status = Status.PENDING;
  }
}
