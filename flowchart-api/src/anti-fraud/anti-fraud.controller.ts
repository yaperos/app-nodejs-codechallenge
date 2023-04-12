import {Controller} from '@nestjs/common';
import {AntiFraudService} from './anti-fraud.service';
import {MessagePattern, Payload} from "@nestjs/microservices";

@Controller('anti-fraud')
export class AntiFraudController {
    constructor(private readonly antiFraudService: AntiFraudService) {
    }

    @MessagePattern('transactions')
    async consumer(@Payload() message: any) {
        await this.antiFraudService.manageTransaction(message);
    }
}
