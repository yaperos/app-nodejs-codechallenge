import { Transaction } from "src/typeorm/transaction.entity";

export class TransactionResponse{
    constructor(
        public transactionExternalId:string,
        public transactionType:TransactionType,
        public transactionStatus:TransactionStatus,
        public value:number,
        public createdAt : Date
    ){}

    static fromRaw(transc:any){
        return new TransactionResponse(
            transc.transactionExternalId,
            transc.transactionType,
            transc.transactionStatus,
            transc.value,
            transc.createdAt
        );
    }
 
    public toTransaction(){
        let newTransac =new Transaction(); 
        newTransac.id = Number.parseInt(this.transactionExternalId);
        newTransac.value = this.value;
        newTransac.transactionStatus = TransactionStatus.fromRaw(this.transactionStatus).name;
        newTransac.transactionType = TransactionType.fromRaw(this.transactionType).name;
        return newTransac;
    }
    static fromTransaction(transac:Transaction){
       return new TransactionResponse(
            transac.id+'',
            new TransactionType(transac.transactionType),
            new TransactionStatus(transac.transactionStatus),
            transac.value,
            transac.createdAt
        );

    }
}

export class TransactionType{
    constructor(
        public name:string
    ){}
    static fromRaw(type:any){
        return new TransactionType(
            type.name
        );
    }
}

export class TransactionStatus{
    constructor(
        public name : string
    ){}

    static fromRaw(type:any){
        return new TransactionStatus(
            type.name
        );
    }
    

    public static PENDING = "1";
    public static APPROVED = "2";
    public static REJECTED = "3";
}