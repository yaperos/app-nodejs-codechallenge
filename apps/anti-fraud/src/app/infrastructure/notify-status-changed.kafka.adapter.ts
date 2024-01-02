import { UUID } from "crypto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { MICROSERVICES_CONSTANTS } from "@yape-transactions/shared";
import { NotifyStatusChangedPort } from "../domain/notify-status-changed.port";
import { tap } from "rxjs";

@Injectable()
export class NotifyStatusChangedAdapter implements NotifyStatusChangedPort {
    private logger = new Logger(NotifyStatusChangedAdapter.name);

    constructor(
        @Inject(MICROSERVICES_CONSTANTS.TRANSFER_MANAGER_MICROSERVICE.name) private readonly transactionManagerClient: ClientKafka
    ) { }

    notifyStatusChanged(event: string, transferData: { transactionId: UUID }) {
        this.transactionManagerClient.emit(event, JSON.stringify(transferData)).pipe(
            tap(result => {
                this.logger.log(`resultado del envio de actualizacion: ${JSON.stringify(result)}`)
            })
        );
    }

}