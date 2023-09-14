import { StatusTransactions } from '../enums/status.enum';

export interface IMessageKafkaPayload {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: StatusTransactions;
}
