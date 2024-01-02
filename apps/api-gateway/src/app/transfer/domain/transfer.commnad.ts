import { TransactionDto } from "@yape-transactions/shared";

export class TransferCommand {
    transferDto: TransactionDto;
    constructor(transferDto: TransactionDto) {
        this.transferDto = transferDto;
    }
}