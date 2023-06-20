import { Kafka } from "kafkajs";
import env from "../env/env";

export class KafkaQueue {
    private readonly client: Kafka;

    constructor(){
        this.client = new Kafka({
            clientId: env.Queue.ClientId,
            brokers : env.Queue.Brokers
        })
    }

    getConsumer(){
        return this.client.consumer({
            groupId: env.Queue.GroupId
        })
    }

    getProducer(){
        return this.client.producer()
    }
}