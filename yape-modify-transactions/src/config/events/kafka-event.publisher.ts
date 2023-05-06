import { Inject, Injectable } from "@nestjs/common";
import { IEvent, IEventPublisher } from "@nestjs/cqrs";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class KafkaEventPublisher implements IEventPublisher {

    constructor(@Inject('KAFKA_CLIENT') private client: ClientKafka) { }

    publish<T extends IEvent = IEvent>(event: T) { 
        console.log(JSON.stringify(event));       
        this.client.emit('yape-transactions-created-topic', JSON.stringify(event));
    }
}