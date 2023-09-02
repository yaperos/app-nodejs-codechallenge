import { Inject } from "@nestjs/common";
import { CreatedTransactionEvent } from "src/transaction/domains/event/created.transaction.event";
import { StatusTransactionModel } from "src/transaction/domains/model/statustransaction.model";
import { Status } from "src/transaction/infraestructures/entities/status";
import { TransactionRepository } from "src/transaction/infraestructures/repositories/transaction.repository";

export class CreateTransactionEventIntegratedHandler{
    
    //@Inject() private readonly transactionRepository: TransactionRepository;
    
    public async HandleCreateTransaction(value : CreatedTransactionEvent){
        // se debe llamar a un comando de validacion si cumple la validacion se debe disparar un evento por kafka de 
        // Aprovved sino  de Rejected el controlador de estos eventos actualiza el estado de la transaccion
        
        console.log('paso kafka');
        const model = new StatusTransactionModel({ id: value.id, status:Status.PENDING  });        
        if(value.value > 1000) {
            console.log('Rejected');           
            model.status= Status.REJECTED; 
        }
        else
        {
            console.log('Aprovved');
            model.status= Status.APROBBED;
        }    
        console.log(model);
        await new TransactionRepository().updateStatusTransaction(model);
    }
}