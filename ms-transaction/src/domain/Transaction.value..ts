import { Status } from "src/helper/const.helper";
import { TransactionEntity } from "./Transaction.entity";
import { TransactionRequest } from "src/helper/type.helper";


export class TransactionValue implements TransactionEntity{
    id:number;
    accountExternalIdDebit:string;
    accountExternalIdCredit:string;
    tranferTypeId:number;
    value:number;
    status:Status;

    constructor(data:TransactionRequest){
        this.accountExternalIdCredit=data.accountExternalIdCredit;
        this.accountExternalIdDebit=data.accountExternalIdDebit;
        this.tranferTypeId=data.tranferTypeId;
        this.value=data.value;
        this.status=Status.PENDING;
    }

}