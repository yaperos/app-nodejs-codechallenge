import { Inject, Logger, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Observable, map, tap } from "rxjs";
import { MICROSERVICES_CONSTANTS, TransactionDto, TransactionResult } from "@yape-transactions/shared";
import { TransactionRepositoryPort } from "../domain/transaction-repository.port";
import { UUID } from "crypto";

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


    findTransaction(transactionId: UUID): Observable<TransactionResult> {
        return this.transferManagerClient.send(MICROSERVICES_CONSTANTS.EVENTS.GET_TRANSACTION, {
            transactionId
        }).pipe(
            map(
                result => {
                    this.logger.debug(`map -> transaccion obtenida ${JSON.stringify(result)}`);
                    if (result === "null") {
                        return null;
                    }
                    return result as TransactionResult;
                }
            )
        )
    }


    onModuleInit() {
        this.transferManagerClient.subscribeToResponseOf(MICROSERVICES_CONSTANTS.EVENTS.CREATE_TRANSACTION);
        this.transferManagerClient.subscribeToResponseOf(MICROSERVICES_CONSTANTS.EVENTS.GET_TRANSACTION);
    }
}