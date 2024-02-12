import { Status } from '@app/common/constants/constants';

export interface AntiFraud {
  transactionId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  status: Status;
}
