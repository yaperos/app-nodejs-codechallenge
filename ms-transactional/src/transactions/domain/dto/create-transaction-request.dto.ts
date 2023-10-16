import { Channel, TransferType } from '../entity/transaction';

export interface CreateTransactionRequestDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  channel: Channel;
  transferType: TransferType;
  value: number;
}
