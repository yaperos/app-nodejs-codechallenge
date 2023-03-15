import { Inject, Injectable } from '@nestjs/common';
import { TOPIC_VALIDATION } from './constants/topic-validation.enum';
import { ClientProxy } from '@nestjs/microservices';
import { TransactionValidateDto } from './dto/transaction-validate.dto';
import { VALIDATION_LIMIT_VALUE_TRANSACTION } from './constants/app.constants';

@Injectable()
export class AntifraudService {
  constructor(
    @Inject(process.env.KAFKA_NAME_MODULE || 'kafka')
    private readonly kafkaService: ClientProxy,
  ) {}

  public validateTransaction(
    transactionValidate: TransactionValidateDto,
  ): void {
    
    if (transactionValidate.value > VALIDATION_LIMIT_VALUE_TRANSACTION) {
      this.kafkaService.emit(
        TOPIC_VALIDATION.TRANSACTION_REJECTED,
        JSON.stringify(transactionValidate),
      );
    } else {
      this.kafkaService.emit(
        TOPIC_VALIDATION.TRANSACTION_APPROVED,
        JSON.stringify(transactionValidate),
      );
    }
  }
}
