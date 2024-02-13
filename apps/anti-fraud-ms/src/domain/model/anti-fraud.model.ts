import { Status } from '@app/common/constants';

export interface AntiFraud {
  transactionId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  status: Status;
}
