import { Status } from '@app/common/constants/constants';

export interface Transaction {
  id?: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  status: Status;
}
