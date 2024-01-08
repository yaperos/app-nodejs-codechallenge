import {sendKafkaMessage} from "../producers/kafka-producer";
import {logger} from "../../../domain/bootstrap/logger";

export class KafkaService {

    sendApproveTransaction(id: string, value: number) {
        const topic = 'transaction-approved'
        sendKafkaMessage({id, value}, topic).then(r => {
            logger.log('Send approve transaction id:' + id + ', value: ' + value)
        });
    }

    sendRejectTransaction(id: string, value: number) {
        const topic = 'transaction-rejected'
        sendKafkaMessage({id, value}, topic).then(r => {
            logger.log('Send rejected transaction id:' + id + ', value: ' + value)
        });
    }

}