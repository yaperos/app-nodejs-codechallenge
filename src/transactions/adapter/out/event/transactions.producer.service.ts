import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ValidateTransactionRequestDto } from './dto/validate-transaction-request-dto';

@Injectable()
export class TransactionsProducerService {
  constructor(
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly transactionClient: ClientKafka
  ) {}

    async validateTransaction(validateTransactionRequestDto: ValidateTransactionRequestDto) {
        const dto = JSON.stringify(validateTransactionRequestDto);
        return this.transactionClient.emit('validate_transaction', dto)
            .subscribe(() => console.log('TransactionsProducerService: data: ' + dto));
    }
}