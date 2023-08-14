import { IEventService } from "../../domain/event.service";
import eventEntity from "../../domain/event.entity";
import { KafkaQueue } from "../config/queue/kafka"
import { Producer } from "kafkajs";

export class EventService implements IEventService {
    private readonly queue: KafkaQueue = new KafkaQueue();
    private readonly producer: Producer;
    constructor(){ 
        this.producer = this.queue.getProducer();
    }
    
    async checkLimit(topic: string, transaction: eventEntity): Promise<any | null> {
        try {
            await this.producer.connect()
            await this.producer.send({
                topic: topic,
                messages: [
                    {
                        value: JSON.stringify(transaction)
                    }
                ]
            })
            return null
        } catch(err: any){
            return err
        }
    }
}