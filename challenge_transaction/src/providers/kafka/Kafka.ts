import { Kafka, Consumer } from 'kafkajs';
import { IKafkaMessage } from "./IKafka";
import { KafkaConfig } from '../../config/KafkaConfig';

class KafkaDrive{
    private iKafkaMessageTemp:IKafkaMessage|undefined;
    constructor(iKafkaMessage?:IKafkaMessage) {
        this.iKafkaMessageTemp = iKafkaMessage;
    }

    async producer(){
        let kafkaConfig:KafkaConfig = new KafkaConfig();
        const kafka:Kafka = kafkaConfig.getKafka();

        const producer = kafka.producer();
        await producer.connect();
        if(this.iKafkaMessageTemp){
            return await producer.send({
                topic: this.iKafkaMessageTemp.topic,
                messages: this.iKafkaMessageTemp.message,
            });
        }else{
            console.error({cod:403,message:"solo se permite enviar mensaje si existe el mensaje"});
        }
    }

    async consumer(){
        let kafkaConfig:KafkaConfig = new KafkaConfig();
        const kafka:Kafka = kafkaConfig.getKafka();
        const consumer:Consumer = kafka.consumer({ groupId:  kafkaConfig.getConfig().groupID})
        await consumer.connect()
        await consumer.subscribe({ topic: kafkaConfig.getConfig().consumerID, fromBeginning: true })

        return consumer;
        /*return await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    partition,
                    offset: message?.offset,
                    value: message?.value?.toString(),
                });
            },
        });*/
    }
}

export {KafkaDrive}