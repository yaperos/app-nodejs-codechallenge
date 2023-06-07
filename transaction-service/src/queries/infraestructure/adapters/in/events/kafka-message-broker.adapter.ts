import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CommandBus } from "@nestjs/cqrs";
import { TransactionMapper } from "./mappers/transaction.mapper";

@Controller()
export class KafkaMessageBrokerAdapter {
    constructor(
        private readonly commandBus: CommandBus
    ) { }

    @MessagePattern('topic-syncronize_transaction')
    async consumeEvent(@Payload() payload: any) {
        const obj = JSON.parse(JSON.stringify(payload));
        await this.commandBus.execute(TransactionMapper.toCommand(obj));
    }
}