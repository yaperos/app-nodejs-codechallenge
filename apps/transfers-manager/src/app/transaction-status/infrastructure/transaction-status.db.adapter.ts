import { Injectable, Logger } from "@nestjs/common";
import { TransactionStatusPort } from "../domain/transaction-status.port";
import { NEW_STATUS_TRANSACTION, TransactionEntity } from "@yape-transactions/shared";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TransactionStatusDbAdapter implements TransactionStatusPort {
    private logger = new Logger(TransactionStatusDbAdapter.name);

    constructor(@InjectRepository(TransactionEntity) private readonly txRepository: Repository<TransactionEntity>) {

    }

    updateTransactionStatus(txData: NEW_STATUS_TRANSACTION) {
        this.txRepository.update({
            transactionId: txData.transactionId
        }, {
            status: txData.status
        })
            .then(updateResult => {
                this.logger.debug(`Actualiacion realizada, result: ${JSON.stringify(updateResult)}`);
            })
            .catch(err => {
                this.logger.error(`Error al actualizar estado de transaccion, datos: ${JSON.stringify(txData)}, error: ${err.message}`);
            })
    }

}
