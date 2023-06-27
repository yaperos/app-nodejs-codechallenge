import { AntiFraudInterface } from "../../domain/interfaces/antifraud.interface";
import { TransactionType } from "../../domain/types/transaction.interface";
import { AntiFraudService } from "../../application/antifraud.usecase"

export class AntiFraudImplementation implements AntiFraudInterface {
    public antiFraudService:AntiFraudService
    constructor(){
        this.antiFraudService = new AntiFraudService()
    }
    verify(transaction:TransactionType): boolean {
        return this.antiFraudService.verify(transaction)
    }
}