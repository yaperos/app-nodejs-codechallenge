import { Status } from 'src/helper/const.helper';

export interface TransactionEntity {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  status: Status;
}


export interface TransactionTypeEntity{
  id:number;
  name:string;
}