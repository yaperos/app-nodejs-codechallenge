import { UUID } from "crypto";

export class GetTransactionCommand {
    transactionId: UUID;
    constructor(transactionId: UUID) {
        this.transactionId = transactionId;
    }
}