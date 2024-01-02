import { Inject, Injectable, Logger } from "@nestjs/common";
import { TransactionStatusCommand } from "../domain/transaction-status.command";
import { TRANSACTION_STATUS_PORT_TOKEN, TransactionStatusPort } from "../domain/transaction-status.port";

@Injectable()
export class TransactionStatusService {
    private logger = new Logger(TransactionStatusService.name);

    constructor(@Inject(TRANSACTION_STATUS_PORT_TOKEN) private readonly txStatusPort: TransactionStatusPort) {

    }

    updateTransactionStatus(command: TransactionStatusCommand) {
        this.logger.log(`procesando actualizacion de estado para la tx: ${JSON.stringify(command)}`)
        this.txStatusPort.updateTransactionStatus(command.transactionData);
    }
}