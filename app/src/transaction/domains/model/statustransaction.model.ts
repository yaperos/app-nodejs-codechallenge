import { AggregateRoot } from "@nestjs/cqrs";
import { Status } from "src/transaction/infraestructures/entities/status";


export type StatusTransactionRequiredProperties = Readonly<
    Required<{        
        id: string;
        status:Status;        
    }>>

  
export type StatusTransactionProperties = StatusTransactionRequiredProperties //&


export class StatusTransactionModel extends AggregateRoot
{
    constructor(properties: StatusTransactionProperties) {
        console.log("StatusTransactionModel: " + properties)
        super();

        Object.assign(this, properties);
        console.log("fin StatusTransactionModel")
    }    
    id:string;
    status: Status;    
}