import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EnvConfig } from '../../config/env.config';
import { TransactionPattern, ValidateTransactionDto } from './antifraud.types';

@Injectable()
export class AntifraudService {
  constructor(
    @Inject(EnvConfig.transactionKafkaConfig().name)
    private readonly transactionClient: ClientKafka,
  ) {}

  async validateTransaction(validateDto: ValidateTransactionDto) {
    try {
      Logger.log(
        `Validate transaction request started with: ${JSON.stringify(
          validateDto,
        )}`,
        AntifraudService.name,
      );
      const isValidAmount = validateDto.amount <= EnvConfig.transactionLimit();

      Logger.log(
        `Validation finished with value: ${isValidAmount}`,
        AntifraudService.name,
      );

      this.transactionClient.emit(TransactionPattern.VALIDATE_TRANSACTION, {
        id: validateDto.id,
        isValidAmount,
      });
    } catch (error) {
      Logger.error(error.message, AntifraudService.name);
    }
  }
}
