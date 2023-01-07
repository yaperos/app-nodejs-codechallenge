import { Transaction } from "src/typeorm/transaction.entity";
import { TransactionStatus } from "./transaction.response";

export class TransactionRequest{
    constructor(
        public accountExternalIdDebit: string,
        public accountExternalIdCredit: string,
        public tranferTypeId: number,
        public value: number){
    }

    static fromRaw(transc:any){
        return new TransactionRequest(
            transc.accountExternalIdCredit,
            transc.accountExternalIdCredit,
            transc.tranferTypeId,
            transc.value
        );
    }
 
    public toTransaction(){
        let newTransac =new Transaction();
        newTransac.accountExternalIdCredit = this.accountExternalIdCredit;
        newTransac.accountExternalIdDebit = this.accountExternalIdDebit;
        newTransac.value = this.value;
        newTransac.tranferTypeId = this.tranferTypeId;
        newTransac.transactionStatus = TransactionStatus.PENDING;
        newTransac.transactionType = "";
        return newTransac;
    }
}