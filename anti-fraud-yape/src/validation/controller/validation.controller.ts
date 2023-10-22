import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Controller('validation')
export class ValidationController {

    constructor(
        @Inject('ANTIFRAUD_SERVICE')
        private readonly kafka: ClientProxy
    ) { }

    @EventPattern('transaction_created')
    handlerTransactionCreated(data: any) {
        console.log("==========NEW EVENT TRANSACTION");
        console.log(data);
        const { message } = data;
        this.kafka.emit('transaction_updated', {
            message: {
                ...message,
                transactionStatusId: message.value > 1000 ? 3 : 2
            }
        });
    }
}
