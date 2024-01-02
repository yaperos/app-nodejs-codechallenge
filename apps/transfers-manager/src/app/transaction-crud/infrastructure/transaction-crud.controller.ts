import { Controller, ValidationPipe } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MICROSERVICES_CONSTANTS, TransactionDto } from "@yape-transactions/shared";
import { TransactionCrudService } from "../application/transaction-crud.service";
import { CreateTransactionCommand } from "../domain/create-transaction.command";


@Controller()
export class TransactionCrudController {

    constructor(private readonly txCrudSrv: TransactionCrudService) { }

    @MessagePattern(MICROSERVICES_CONSTANTS.EVENTS.CREATE_TRANSACTION)
    //ValidationPipe
    handleCreateTransaction(@Payload() transactionInfo: TransactionDto) {
        console.log('transactionInfo', JSON.stringify(transactionInfo));
        const createTransactionCommand = new CreateTransactionCommand(transactionInfo);
        return this.txCrudSrv.createTransaction(createTransactionCommand);
    }

}