import TransactionMessageDTO from '../domain/models/TransactionMessageDTO'
import { StatusCode } from '../domain/constants/Transaction'
import KafkaProducer from '../commons/utils/KafkaProducer'
import { KafkaConstants } from '../domain/constants/Kafka'

export default class TransactionStatusService{
    updateStatus = (transactionMessage:TransactionMessageDTO)=>{
        transactionMessage.transactionStatusId = this.evaluateStatus(transactionMessage.value);    
        const kafkaproducer = new KafkaProducer();
        kafkaproducer.sendMessage(KafkaConstants.TRANSACTION_EVALUATED_TOPIC,[{value:JSON.stringify(transactionMessage)}]);
    }

    private evaluateStatus=(value:number)=>{
        let status:number;
        value>1000?status=StatusCode.REJECTED: status= StatusCode.APPROVED;
        return status;
    }

}
