import { Status } from "src/helper/const.helper";

export interface TransactionEntity{
    id?:number;
    accountExternalIdDebit:string;
    accountExternalIdCredit:string;
    tranferTypeId:number;
    value:number;
    status:Status;
}