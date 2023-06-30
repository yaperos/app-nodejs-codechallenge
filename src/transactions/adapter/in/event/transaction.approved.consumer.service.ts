import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from '../../../use-case/transactions.service';
import { TransactionValidatedRequestDto } from './dto/transaction-validated-request-dto';

@Controller()
export class TransactionApprovedConsumerService {

    constructor(private transactionsService: TransactionsService) { }

    @EventPattern('transaction_approved')
    validateTransaction(@Payload(ValidationPipe) data: TransactionValidatedRequestDto) {
        console.log('TransactionApprovedConsumerService: data: ' + JSON.stringify(data));

        return this.transactionsService.update(data)
            .then(response => console.log('TransactionApprovedConsumerService: data: ' + JSON.stringify(data) + ' - UPDATED'));
    }
}