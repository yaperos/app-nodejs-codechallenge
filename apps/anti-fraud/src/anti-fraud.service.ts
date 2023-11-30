import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MAX_TRANSACTION_AMOUNT } from '@app/constants/transactionAmount';
import { KAFKA_SERVICES, TRANSACTION_EVENTS } from '@app/constants';
import { IParamEmitToTransactionService } from './interfaces/param.interface';

@Injectable()
export class AntifraudService {
  constructor(
    @Inject(KAFKA_SERVICES.TRANSACTION) private kafkaClient: ClientKafka,
  ) {}
  /**
   * This Function should validate whatever is needed to ensure security in transactions,
   * In this case is just validating the value of the transaction...
   */
  async validateTransaction(transactionData) {
    // Some validations ...
    const { value, transactionExternalId } = transactionData;
    const transactionStatus = this.transactionValueValidation(value);
    const paramsEmitToTransactionService: IParamEmitToTransactionService = {
      transactionStatus,
      transactionExternalId,
    };
    await this.emitToTransaction(paramsEmitToTransactionService);
  }

  transactionValueValidation(value: number) {
    if (value > MAX_TRANSACTION_AMOUNT) return 'REJECTED';
    return 'APPROVED';
  }

  async emitToTransaction(
    paramsEmitToTransactionService: IParamEmitToTransactionService,
  ) {
    const { transactionStatus, transactionExternalId } =
      paramsEmitToTransactionService;
    const event = TRANSACTION_EVENTS[transactionStatus.toString()];
    this.kafkaClient.emit(event, transactionExternalId);
  }

  async testEmit() {
    this.kafkaClient.emit('transaction_rejected', '13233');
  }
}
