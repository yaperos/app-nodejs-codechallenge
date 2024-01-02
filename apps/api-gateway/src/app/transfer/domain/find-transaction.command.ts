import { UUID } from "crypto";

export class FindTransactionCommand {
    transactionId: UUID;
    constructor(transactionId: UUID) {
        this.transactionId = transactionId;
    }
}