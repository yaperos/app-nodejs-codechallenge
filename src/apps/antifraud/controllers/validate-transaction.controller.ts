import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ValidateTransactionController {
    constructor() {}

    @MessagePattern('transaction_created')
    getHello(@Payload() data: any): any {
        console.log('DATAAAA', data);
        return { valid: true };
    }
}
