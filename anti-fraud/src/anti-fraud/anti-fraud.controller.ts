import { Controller } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { EventPattern } from '@nestjs/microservices';
import { AntiFraudRequest } from './anti-fraud.dto';

@Controller('anti-fraud')
export class AntiFraudController {
    constructor(private readonly antiFraudService: AntiFraudService) {}

    @EventPattern('anti_fraud_validate')
    handlerTransactionCreated(data: AntiFraudRequest) {
        this.antiFraudService.handlerAntiFraudValidate(data);
    }
}
