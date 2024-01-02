import { Injectable, Logger } from "@nestjs/common";
import { TransactionStatusCommand } from "../domain/transaction-status.command";

@Injectable()
export class TransactionStatusService {
    private logger = new Logger(TransactionStatusService.name);

    updateTransactionStatus(command: TransactionStatusCommand) {
        this.logger.log(`procesando actualizacion de estado para la tx: ${JSON.stringify(command)}`)
        return true;
    }
}