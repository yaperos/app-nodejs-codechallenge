import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from '@nestjs/microservices';
import {AntiFraudService} from './anti-fraud.service';
import {PendingValidAntiFraudDto} from './dto/pending-valid-anti-fraud.dto';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) {}

  @MessagePattern('valid-anti-fraud-send')
  validAntiFraud(@Payload() createAntiFraudDto: PendingValidAntiFraudDto) {
    return this.antiFraudService.validAntiFraud(createAntiFraudDto);
  }
}
