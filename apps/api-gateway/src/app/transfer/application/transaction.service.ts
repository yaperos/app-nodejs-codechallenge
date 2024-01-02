import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Observable, map, tap } from "rxjs";
import { TransferCommand } from "../domain/transfer.commnad";
import { TRANSACTION_REPOSITORY_PORT_TOKEN, TransactionRepositoryPort } from "../domain/transaction-repository.port";
import { CommonResponse } from "@yape-transactions/shared";
import { UUID } from "crypto";
import { FindTransactionCommand } from "../domain/find-transaction.command";

@Injectable()
export class TransactionService {
    private logger = new Logger(TransactionService.name);

    constructor(
        @Inject(TRANSACTION_REPOSITORY_PORT_TOKEN) private readonly transferRepositoryPort: TransactionRepositoryPort
    ) { }

    createTransaction(command: TransferCommand): Observable<CommonResponse<{ transactionId: UUID }>> {
        this.logger.debug(`creando transaccion con parametros ${command}`);

        return this.transferRepositoryPort.createTransaction(command.transferDto).pipe(
            map((transactionId) => {
                return { message: "Transaccion creada correctamente", data: { transactionId } };
            })
        );
    }

    findTransaction(command: FindTransactionCommand) {
        return this.transferRepositoryPort.findTransaction(command.transactionId).pipe(
            map(result => {
                if (!result) {
                    throw new NotFoundException({
                        message: "Transaction not found"
                    })
                }
                return result;
            })
        )
    }
}