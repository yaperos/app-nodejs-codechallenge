import { Controller, Logger } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AntiFraudController {

    constructor(
        private readonly antiFraudService: AntiFraudService
    ){}
    
    @EventPattern('transaction-created')
    async transactionValidate(@Payload() payload: any){
        Logger.log('Validando transaccion...', payload);
        this.antiFraudService.transactionValidate(payload);
    }
}
