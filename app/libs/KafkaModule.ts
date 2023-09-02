import { DynamicModule, Global, Inject, Injectable, Module, OnApplicationShutdown } from "@nestjs/common";
import { Consumer, ConsumerConfig,  ConsumerSubscribeTopics, Kafka, KafkaMessage, Message, Producer } from "kafkajs";
import retry from 'async-retry';

@Injectable()
export class KafkaService implements OnApplicationShutdown 
{
    private readonly kafkaClient : Kafka
    private readonly consumers : Consumer[]=[];
    private readonly producers= new Map<string,Producer>();
    
    
    
    constructor(@Inject('KAFKA_BROKER') broker:string){        
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
        try {
            //await retry(
            //    async() => 
            await producer.send({topic: topic,messages: [message]});
            //    { 
            //        retries:3,
            //        onRetry:(e,attempt) => {console.log(e);}
            //    }
            //)            
        }
        catch (err) {
            console.log(err);
        }        
    }        

    async consume(topic: string,groupId: string, onMessage: (message:any)=>Promise<void> ){        
        const t : ConsumerSubscribeTopics={topics:[topic],fromBeginning:false}
        const c: ConsumerConfig = {groupId: groupId,allowAutoTopicCreation:true};
        const consumer: Consumer= this.kafkaClient.consumer(c);
        await consumer.connect();
        await consumer.subscribe(t);  
        
        await consumer.run({
            eachMessage: async({topic, partition,message})=>
            { 
                try
                { 
                    //await retry(async()=>
                    //    {
                            const value = JSON.parse(message.value.toString());
                            await onMessage(value);
                    //    }, 
                    //    {
                    //        retries: 3,
                    //        onRetry: (error,attempt) => {console.log(`error consuming message, executing retry ${attempt}/3`);}       
                    //    }
                    //)
                }
                catch(err)
                {
                    console.log(err);
                }
            } 
        })
        this.consumers.push(consumer);
    }
    async onApplicationShutdown(signal?: string) {
        for(const c of this.consumers){
            await c.disconnect();
        }
    }
}

@Global()
@Module({})
export class KafkaModule
{
    static register(broker):DynamicModule
    {
        return {
            module: KafkaModule,
            providers:[
                {
                    provide: 'KAFKA_BROKER',
                    useValue: broker
                }, KafkaService
            ],
            exports: [KafkaService]
        }
    }
}