import { CreateAntiFraudDto, LoggerService } from '@app/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateTransactionService {
  constructor(private readonly logger: LoggerService) {}

  validationValue(createAntiFraudDto: CreateAntiFraudDto) {
    this.logger.info(
      `${ValidateTransactionService.name}.entry`,
      createAntiFraudDto,
    );
    return {
      transactionExternalId: createAntiFraudDto.transactionExternalId,
      value: createAntiFraudDto.value,
      status: createAntiFraudDto.value > 1000 ? 3 : 2,
    };
  }
}
