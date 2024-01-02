import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { TransactionDto } from "@yape-transactions/shared";
import { TransactionService } from "../application/transaction.service";
import { TransferCommand } from "../domain/transfer.commnad";

@Controller()
export class TransferController {

    constructor(private transferService: TransactionService) {

    }

    @Post('v1/transfer')
    createTransfer(@Body(ValidationPipe) trnsferDto: TransactionDto) {
        const command = new TransferCommand(trnsferDto);
        return this.transferService.createTransaction(command);
    }
}