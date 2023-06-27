import { AntiFraudInterface } from "../domain/interfaces/antifraud.interface";
import { TransactionType } from "../domain/types/transaction.interface";

export class AntiFraudService implements AntiFraudInterface {
    public transaction
    constructor(){
    }
    public verify(transaction:TransactionType){
        return transaction.value < 1000 ? true : false 
    }
}