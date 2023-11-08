import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';
import { CreateAntiFraudDto } from './dto/create-anti-fraud.dto';
import { KAFKA_TRANSACTION_FRAUD } from 'src/config/kafka.config';

@Controller()
export class AntiFraudController {
  private logger = new Logger(AntiFraudService.name);

  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern(KAFKA_TRANSACTION_FRAUD)
  create(@Payload() createAntiFraudDto: CreateAntiFraudDto) {
    this.logger.log(KAFKA_TRANSACTION_FRAUD, createAntiFraudDto);
    return this.antiFraudService.create(createAntiFraudDto);
  }
}
