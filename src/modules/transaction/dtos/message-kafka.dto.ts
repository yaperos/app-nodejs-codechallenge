import { StatusTransactions } from '../enums/status.enum';

export class MessageKafkaPayloadDto {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: StatusTransactions;
}
