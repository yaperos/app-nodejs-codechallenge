import { Controller, Logger } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AntiFraudController {

    constructor(
        private readonly antiFraudService: AntiFraudService
    ){}
    
    @MessagePattern('transaction.created')
    async transactionValidate(@Payload() payload: any){
        Logger.log('validando transaccion', payload);
    }
}
