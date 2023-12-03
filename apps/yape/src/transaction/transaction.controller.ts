import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class TransactionController {
    constructor() { }

    @MessagePattern('antifraud.confirmed')
    confirmed(@Payload() { id, status }: any) {
        console.log({ id, status });
    }
}
