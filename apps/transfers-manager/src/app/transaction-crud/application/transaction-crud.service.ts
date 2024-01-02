import { Inject, Injectable } from "@nestjs/common";
import { of, tap } from "rxjs";
import { CreateTransactionCommand } from "../domain/create-transaction.command";
import { ANTI_FRAUD_SERVICE_PORT_TOKEN, AntiFraudServicePort } from "../domain/anti-fraud-service.port";
import { UUID } from "crypto";
import { CREATE_TRANSACTION_PORT_TOKEN, CreateTransactionPort } from "../domain/create-transaction.port";

@Injectable()
export class TransactionCrudService {

    constructor(
        @Inject(ANTI_FRAUD_SERVICE_PORT_TOKEN) private readonly antiFraudServicePort: AntiFraudServicePort,
        @Inject(CREATE_TRANSACTION_PORT_TOKEN) private readonly createTransactionPort: CreateTransactionPort
    ) { }
    createTransaction(command: CreateTransactionCommand) {
        console.log('[TransactionCrudService] creating transaction')
        return this.createTransactionPort.createTransaction(command.transactionData).pipe(
            tap(transactionId => {
                command.transactionData.trnsactionId = transactionId;
                this.antiFraudServicePort.triggerAntiFraudService(command);
            })
        )
    }
}