import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { envs, TRANSACTION_SERVICE } from 'src/config';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { delay } from 'rxjs';

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger('AntiFraudService');
  constructor(
    @Inject(TRANSACTION_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {}

  async verifyTransaction(verifyTransactionDto: VerifyTransactionDto) {
    // * Doing something about verifying the created transaction
    this.logger.log(`Start of transaction validation`);
    await delay(Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000);
    this.logger.log(`End of transaction validation`);

    let status = 'APPROVED';

    if (verifyTransactionDto.value > envs.MAX_VALUE_TRANSACTION)
      status = 'REJECTED';

    const request = { ...verifyTransactionDto, status: status };
    this.kafkaClient.emit('update.transaction', JSON.stringify(request));
  }
}
