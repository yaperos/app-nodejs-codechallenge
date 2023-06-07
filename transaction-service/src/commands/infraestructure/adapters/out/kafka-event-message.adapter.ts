import { Inject, Injectable } from "@nestjs/common";
import { EventMessagePort } from "../../ports/out/event-message.port";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class KafkaEventMessageAdapter implements EventMessagePort {
    constructor(
        @Inject('KAFKA_TRANSACTION_COMMAND_SERVICE') private readonly clientKafka: ClientProxy
    ) {}

    sendMessage(topic: string, payload: string) {
        this.clientKafka.emit(topic, payload);
    }
}