import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionInputOnject } from './dto/inputs/transaction.input';
import { TransactionStatus } from './enums/transaction-status.enum';
import { CreateTransactionInput, UpdateTransactionInput } from './dto/inputs';


@Controller('transaction')
export class TransactionController {

    constructor(
        private readonly transactionService: TransactionService
    ){}

    @MessagePattern('transaction.receipt')
    public async TransactionReceipt(@Payload() Transaction: CreateTransactionInput) {
        this.transactionService.create( Transaction );
    }

    @MessagePattern('message.created')
    public async TransactionCreated(@Payload() Transaction: TransactionInputOnject) {
        const transactionupdate = new UpdateTransactionInput()

        if(Transaction.transactionCreated.value > 1000){
            transactionupdate.transactionStatus = TransactionStatus.rejected;
        }else{
            transactionupdate.transactionStatus = TransactionStatus.approved;
        } 

        transactionupdate.id = Transaction.transactionCreated.id;

        this.transactionService.update(transactionupdate.id, transactionupdate.transactionStatus );
    }
}
