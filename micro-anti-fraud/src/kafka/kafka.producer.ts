import { KafkaClient, Producer, ProduceRequest } from 'kafka-node';
import { CONFIG } from '../utils/environments';
import { KAFKA_TOPICS } from '../constants/index';
import { RESOURCE_TRANSACTION } from '../constants/interfaces';


const client = new KafkaClient({
    kafkaHost: CONFIG.KAFKA.URL
})

const producer = new Producer( client );

producer.on('ready', ()=> {
    console.info('Init kafka service producer')
})

producer.on('error', (err)=> {
    console.error(err)
})

export const yapeTaskProducer = (resource: RESOURCE_TRANSACTION) => {
    const payloads: ProduceRequest[] = [{
        topic: KAFKA_TOPICS.TRANSACTION_RESPONSE_VALIDATE,
        messages: JSON.stringify(resource)
    }];

    
    producer.send(payloads, (err, data)=>{
        if(err) console.error(err);
        console.info(`Data send: ${JSON.stringify(data)}`)
    })
}