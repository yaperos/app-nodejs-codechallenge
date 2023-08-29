import { AggregateRoot } from "@nestjs/cqrs";
import { CreatedTransactionEvent } from "../event/created.transaction.event";

export interface ITransactionModel {
    crear: () => void;
    commit: () => void;
}

export type TransactionProperties = Readonly<
    Required<{        
        accountExternalIdDebit: string;   
        accountExternalIdCredit: string;
        tranferTypeId:number;
        value: number;    
    }>>

export class TransactionModel extends AggregateRoot implements ITransactionModel  {    
    constructor(properties: TransactionProperties) {
        super();
        Object.assign(this, properties);
    }
    
    //id: string;  
    accountExternalIdDebit: string;   
    accountExternalIdCredit: string;
    tranferTypeId:number;
    value: number;
    //publico el evento de dominio
    crear() :void{
        this.apply(new CreatedTransactionEvent(this.accountExternalIdCredit,this.accountExternalIdDebit,this.tranferTypeId ,this.value));        
    }
}