import { TransactionValidRepository } from "../domain/TransactionValid.repository";
import { AMOUNT_MAX, Status } from "../helper/type.helper";


export class TransactionValidCase implements TransactionValidRepository{
    validTransaction(value: number): Status {
        if(value<=AMOUNT_MAX){
            return Status.APPROVED;
        }else{
            return Status.REJECT;
        }
    }
    
}