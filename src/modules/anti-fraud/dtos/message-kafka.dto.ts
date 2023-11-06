import { StatusTransactions } from '../../transaction/enums/status.enum';

export class MessageKafkaPayloadDto {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: StatusTransactions;
}
