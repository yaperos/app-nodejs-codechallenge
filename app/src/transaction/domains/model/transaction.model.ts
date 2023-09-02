import { AggregateRoot } from "@nestjs/cqrs";
import { CreatedTransactionEvent } from "../event/created.transaction.event";


export interface ITransactionModel {
    crear: (id:string) => void;
    commit: () => void;
}

export type TransactionRequiredProperties = Readonly<
    Required<{        
        accountExternalIdDebit: string;   
        accountExternalIdCredit: string;
        tranferTypeId:number;
        value: number;           
    }>>

    /*
    export type TransactionOptionalProperties = Readonly<
    Partial<{
      status: Status;
    }>
  >;
  */
  export type TransactionProperties = TransactionRequiredProperties //&
    //Required<TransactionOptionalProperties>;


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
    crear(id:string) :void{
        this.apply(new CreatedTransactionEvent(id,this.accountExternalIdCredit,this.accountExternalIdDebit,this.tranferTypeId ,this.value));        
    }
}