import { Injectable, Inject, Logger } from '@nestjs/common';
import { CreateAntiFraudDto } from './dto/create-anti-fraud.dto';
import { ClientKafka } from '@nestjs/microservices';
import { ValidateAntiFraudDto } from './dto/validate-anti-fraud.dto';

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);

  constructor(
    @Inject('ANTI_FRAUD_SERVICE')
    private readonly antiFraudClient: ClientKafka,
  ) {}

  create(createAntiFraudDto: CreateAntiFraudDto) {
    this.logger.log(createAntiFraudDto);

    this.antiFraudClient.emit(
      'transactionValidation',
      new ValidateAntiFraudDto(
        createAntiFraudDto.transactionExternalId,
        createAntiFraudDto.value,
        createAntiFraudDto.value > 1000 ? 'rejected' : 'approved',
      ).toString(),
    );
  }
}
