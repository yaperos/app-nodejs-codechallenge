import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { TRANSACTION_RECEIVED } from "./constants/constants";

@Injectable()
export default class TransactionService{
    constructor(@Inject('TRANSACTION_SERVICE') private client: ClientProxy){}

    public async emitValidateTransaction(data:any): Promise<void> {
        this.client.emit(TRANSACTION_RECEIVED,data);
    }
}