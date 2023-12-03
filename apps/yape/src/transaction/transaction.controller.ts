import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
    constructor(private readonly service: TransactionService) { }

    @MessagePattern('antifraud.confirmed')
    confirmed(@Payload() { id, status }: any) {
        console.log({ id, status });
        return this.service.confirmed(id, status);
    }
}
