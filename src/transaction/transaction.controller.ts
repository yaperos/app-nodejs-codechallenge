import { Controller, Logger } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionInput, TransactionInputOnject } from './dto/inputs/transaction.input';
import { TransactionStatus } from './enums/transaction-status.enum';
import { UpdateTransactionInput } from './dto/inputs';

@Controller('transaction')
export class TransactionController {

    constructor(
        private readonly transactionService: TransactionService,
    ){}

    @MessagePattern('message.created')
    public async TransactionCreated(@Payload() Transaction: TransactionInputOnject) {
        const transactionupdate = new UpdateTransactionInput()

        if(Transaction.transactionCreated.value > 1000){
            transactionupdate.transactionStatus = TransactionStatus.rejected;
        }else{
            transactionupdate.transactionStatus = TransactionStatus.approved;
        } 

        transactionupdate.id = Transaction.transactionCreated.id;

        this.transactionService.update(transactionupdate);
    }
}
