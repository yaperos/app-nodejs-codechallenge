import kafkaConfig from '../../domain/config/Kafka'
import message from '../interfaces/Message'

export default class KafkaProducer {
    
    private producer = kafkaConfig.producer();
    
    sendMessage = async(topic:string, messages:Array<message>)=>{
        await this.producer.connect();
        await this.producer.send({
            topic:topic,
            messages:messages
        });
    }

}

