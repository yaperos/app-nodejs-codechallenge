import { OnApplicationShutdown } from "@nestjs/common";
import { Consumer, ConsumerConfig,  ConsumerSubscribeTopics, Kafka, KafkaMessage } from "kafkajs";
import { retry } from "async-retry";


export class ConsumerService implements OnApplicationShutdown {
    private readonly kafkaClient : Kafka
    private readonly consumers : Consumer[]=[];
    
    constructor(broker:string){
        this.kafkaClient = new Kafka({
            brokers: [broker]
        });        
    }            
    async consume(topic: string,groupId: string, onMessage: (message:any)=>Promise<void> ){        
        const t : ConsumerSubscribeTopics={topics:[topic],fromBeginning:false}
        const c: ConsumerConfig = {groupId: groupId,allowAutoTopicCreation:true};
        const consumer: Consumer= this.kafkaClient.consumer(c);
        await consumer.connect();
        await consumer.subscribe(t);  
        /* 
        await consumer.run({
          eachMessage: async ({message,partition})=> {
            try{
                await retry(async ()=> onMessage(message),{
                    retries:3,
                    onRetry:(error, attempt)=>{console.log(`error consuming message, executing retry ${attempt}/3`)}
                })
            }
            catch(err){
                console.log(err);
            }
          }
        }); */
        await consumer.run({
            eachMessage: async({topic, partition,message})=>
            { 
                //console.log('suscripcion ' + topic + ' partition: ' + partition.toString() + ' message: ' + message.value.toString());
                const value = JSON.parse(message.value.toString());
                await onMessage(value);
                //console.log('fin suscripcion');
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