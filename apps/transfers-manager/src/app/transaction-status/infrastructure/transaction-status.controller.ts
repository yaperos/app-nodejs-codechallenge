import { Controller, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { MICROSERVICES_CONSTANTS, TransactionStatusEnum } from "@yape-transactions/shared";
import { TransactionStatusService } from "../application/transaction-status.service";
import { TransactionStatusCommand } from "../domain/transaction-status.command";
import { TransactionStatusDto } from "./transaction-status.dto";

@Controller()
export class TransactionStatusController {
    constructor(private readonly transferStatusService: TransactionStatusService) { }


    @EventPattern(MICROSERVICES_CONSTANTS.EVENTS.TRANSACTION_APPROVED)
    handleTransactionApproved(@Payload(ValidationPipe) data: TransactionStatusDto) {
        const command = new TransactionStatusCommand({
            transactionId: data.transactionId,
            status: TransactionStatusEnum.APPROVED
        })
        return this.transferStatusService.updateTransactionStatus(command);
    }

    @EventPattern(MICROSERVICES_CONSTANTS.EVENTS.TRANSACTION_REJECTED)
    handleTransactionRejected(@Payload(ValidationPipe) data: TransactionStatusDto) {
        const command = new TransactionStatusCommand({
            transactionId: data.transactionId,
            status: TransactionStatusEnum.REJECTED
        })
        return this.transferStatusService.updateTransactionStatus(command);
    }

}