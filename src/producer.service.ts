import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import {Kafka, Message, Producer} from 'kafkajs'
export class ProducerService implements OnApplicationShutdown
{
    private readonly kafkaClient: Kafka;
    private readonly producers= new Map<string,Producer>();
    
    constructor(private readonly topic:string, broker:string){
        this.kafkaClient = new Kafka({
            brokers: [broker]
        });        
    }

    private async getProducer(topic : string) {
        let producer = this.producers.get(topic);
        if(!producer){
            producer =  this.kafkaClient.producer({ allowAutoTopicCreation: true});        
            await producer.connect();
            this.producers.set(topic, producer);
        }
        return producer;
    }

    async produce (topic:string,message: Message){
        const producer = await this.getProducer(topic);
        await producer.send({topic: topic,messages: [message]});
    }        

    async onApplicationShutdown(signal?: string) {
        for(const p of this.producers.values()){
            await p.disconnect();
        }
    }
}

