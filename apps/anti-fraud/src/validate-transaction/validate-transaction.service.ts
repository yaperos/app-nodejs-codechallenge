import {
  CreateAntiFraudDto,
  LoggerService,
  MAXIMUM_VALUE,
  TRANSACTION_STATUS,
} from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogValidateTransaction } from './entities/validate-transaction.entity';
import { Repository } from 'typeorm';
import { ValidationTransaction } from '@app/shared/validation-transaction/validation-transaction.interface';

@Injectable()
export class ValidateTransactionService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(LogValidateTransaction)
    private logValidateTransactionRepository: Repository<LogValidateTransaction>,
  ) {}

  async validationValue(
    createAntiFraudDto: CreateAntiFraudDto,
  ): Promise<ValidationTransaction> {
    const { transactionExternalId, value } = createAntiFraudDto;

    this.logger.info(
      `${ValidateTransactionService.name}.validationValue.entry`,
      createAntiFraudDto,
      transactionExternalId,
    );

    const record = this.logValidateTransactionRepository.create({
      maximumValue: MAXIMUM_VALUE,
      status:
        value > MAXIMUM_VALUE
          ? TRANSACTION_STATUS.REJECTED
          : TRANSACTION_STATUS.APPROVED,
      transactionExternalId,
    });

    await this.logValidateTransactionRepository.save(record);

    this.logger.info(
      `${ValidateTransactionService.name}.validationValue.record`,
      record,
      transactionExternalId,
    );

    return {
      transactionExternalId: record.transactionExternalId,
      status: record.status,
    };
  }
}
