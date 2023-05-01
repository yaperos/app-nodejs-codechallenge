import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';
import { CreateAntiFraudDto } from './dto/create-anti-fraud.dto';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern('createAntiFraud')
  create(@Payload() createAntiFraudDto: CreateAntiFraudDto) {
    this.antiFraudService.create(createAntiFraudDto);
  }
}
