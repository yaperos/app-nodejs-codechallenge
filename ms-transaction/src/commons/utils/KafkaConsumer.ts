import kafkaConfig from '../../domain/config/Kafka'
import {KafkaConstants} from '../../domain/constants/Kafka'
import TransactionService from '../../service/TransactionService';
import TransactionMessageDTO from '../../domain/models/TransactionMessageDTO';

export default class KafkaConsumer{
    private consumer = kafkaConfig.consumer({groupId: 'transaction-gi'});

    consumirStatus= async(topic:string)=>{
        await this.consumer.connect();
        await this.consumer.subscribe({topics:[topic]})
        await this.consumer.run({
            eachMessage:async({topic,partition,message})=>{
                console.log(`KafkaConsumer: mensaje recibido {topic:${topic}, message:${message.value}}`);

                if(topic == KafkaConstants.TRANSACTION_EVALUATED_TOPIC && message.value != undefined)
                {

                    const transactionMessage = JSON.parse(message.value.toString()) as TransactionMessageDTO;
                    const transactionService = new TransactionService();
                    transactionService.updateTransactionStatusfromMessage(transactionMessage);
                }
                
            }
        });
    }

}