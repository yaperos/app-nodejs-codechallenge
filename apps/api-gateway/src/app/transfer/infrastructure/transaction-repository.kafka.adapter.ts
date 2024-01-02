import { Inject, Logger, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { tap } from "rxjs";
import { MICROSERVICES_CONSTANTS, TransactionDto } from "@yape-transactions/shared";
import { TransactionRepositoryPort } from "../domain/transaction-repository.port";

export class TransactionRepositoryAdapter implements TransactionRepositoryPort, OnModuleInit {
    private logger = new Logger(TransactionRepositoryAdapter.name);

    constructor(
        @Inject(MICROSERVICES_CONSTANTS.TRANSFER_MANAGER_MICROSERVICE.name)
        private readonly transferManagerClient: ClientKafka) {

    }
    createTransaction(transferDto: TransactionDto) {
        return this.transferManagerClient.send(
            MICROSERVICES_CONSTANTS.EVENTS.CREATE_TRANSACTION,
            JSON.stringify(transferDto)).pipe(
                tap(transactionId => {
                    this.logger.log(`transaccion creada con id ${transactionId}}`);
                })
            );
    }


    onModuleInit() {
        this.transferManagerClient.subscribeToResponseOf(MICROSERVICES_CONSTANTS.EVENTS.CREATE_TRANSACTION);
    }
}