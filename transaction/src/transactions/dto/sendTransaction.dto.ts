import { StatusObjectI } from "../interfaces/status.interface";

export class SendTransactionDto {
  id?: number;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  statusArray?: string;
  createdAt?: Date;
}

class EventStatus {
  id: Number;
  accountExternalIdDebit: String;
  accountExternalIdCredit: String;
  tranferTypeId: Number;
  value: Number;
  statusArray?: StatusObjectI;
  createdAt: Date;
}
export class ReceiveTransactionDto {
  eventStatus: EventStatus;
}
