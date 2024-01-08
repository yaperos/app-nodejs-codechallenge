import {sendKafkaMessage} from "../kafka/producers/kafka-producer";
import {Transaction} from "../../domain/entitites/Transaction";
import {logger} from "../../domain/bootstrap/logger";

export class AntiFraudService {
    validateTransaction(message: Transaction) {
        if (message.value > 1000) {
            this.sendRejectTransactionToKafka(message.id, message.value)
        } else {
            this.sendApproveTransactionToKafka(message.id, message.value)
        }
    }

    sendApproveTransactionToKafka(id: string, value: number) {
        const topic = 'transaction-approved'
        sendKafkaMessage({id, value}, topic).then(r => {
            logger.log('Send approve transaction id:' + id + ', value: ' + value)
        });
    }

    sendRejectTransactionToKafka(id: string, value: number) {
        const topic = 'transaction-rejected'
        sendKafkaMessage({id, value}, topic).then(r => {
            logger.log('Send rejected transaction id:' + id + ', value: ' + value)
        });
    }

}