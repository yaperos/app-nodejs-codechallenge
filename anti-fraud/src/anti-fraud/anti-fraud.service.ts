import { Injectable, Inject } from '@nestjs/common';
import { CreateAntiFraudDto } from './dto/create-anti-fraud.dto';
import { ClientKafka } from '@nestjs/microservices';
import { ValidateAntiFraudDto } from './dto/validate-anti-fraued.dto';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('ANTI_FRAUD_SERVICE')
    private readonly antiFraudClient: ClientKafka,
  ) {}

  create(createAntiFraudDto: CreateAntiFraudDto) {
    console.log(createAntiFraudDto);

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
