import { CreatedTransactionEvent } from "src/transaction/domains/event/created.transaction.event";

export class CreateTransactionEventIntegratedHandler{
    
    public async HandleCreateTransaction(value : CreatedTransactionEvent){
        // se debe llamar a un comando de validacion si cumple la validacion se debe disparar un evento por kafka de 
        // Aprovved sino  de Rejected el controlador de estos eventos actualiza el estado de la transaccion
        if(value.value > 1000) {
            console.log('Rejected');            
        }
        else
        {
            console.log('Aprovved');
        }      

    }
}