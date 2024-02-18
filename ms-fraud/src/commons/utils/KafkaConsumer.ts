
import kafkaConfig from '../../domain/config/Kafka'
import {KafkaConstants} from '../../domain/constants/Kafka'
import TransactionMessageDTO from '../../domain/models/TransactionMessageDTO'
import TransactionStatusService from '../../services/TransactionStatusService'

export default class KafkaConsumer{
    private consumer = kafkaConfig.consumer({groupId: KafkaConstants.GROUP_ID});

    consumirStatus= async(topic:string)=>{
        await this.consumer.connect();
        await this.consumer.subscribe({topic:topic,fromBeginning: true})
        await this.consumer.run({
            eachMessage:async({topic,partition,message})=>{
                if(topic == KafkaConstants.TRANSACTION_PENDGING_TOPIC && message.value != undefined)
                {

                    const transactionMessage = JSON.parse(message.value.toString()) as TransactionMessageDTO;
                    const transactionStatusService = new TransactionStatusService();
                    transactionStatusService.updateStatus(transactionMessage);
                }
                
            }
        });
    }

}