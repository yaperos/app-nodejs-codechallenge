import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from '../../../use-case/transactions.service';
import { TransactionValidatedRequestDto } from './dto/transaction-validated-request-dto';

@Controller()
export class TransactionRejectedConsumerService {

    constructor(private transactionsService: TransactionsService) { }

    @EventPattern('transaction_rejected')
    validateTransaction(@Payload(ValidationPipe) data: TransactionValidatedRequestDto) {
        console.log('TransactionRejectedConsumerService: data: ' + JSON.stringify(data));

        return this.transactionsService.update(data)
            .then(response => console.log('TransactionRejectedConsumerService: data: ' + JSON.stringify(data) + ' - UPDATED'));
    }
}