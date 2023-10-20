import { Inject, Injectable, Logger } from "@nestjs/common";
import { KafkaSender } from "../../../core-library/src/sender/kafka.sender";
import { TransactionMessage } from "../common/dto/transaction-message.dto";
import { KafkaConstants } from "../../../core-library/src/common/constants/kafka.constant";
import { Status } from "../../../transactions/src/common/constants/status.constant";


@Injectable()
export class MessageValidatorService{

    @Inject()
    private logger: Logger;

    constructor(
        private readonly kafkaSender: KafkaSender
    ){}
    async validateTransaction( request: any){
        let parsedTransaction : TransactionMessage = request.message;
        this.logger.log(`Parsed transaction value: ${parsedTransaction.value}`);
        let finalStatus = parsedTransaction.value > 1000 ? Status.REJECTED : Status.APPROVED
        
        const response = {
            id:parsedTransaction.id,
            status: finalStatus
        }
        this.kafkaSender.sendMessageToTopic(response, KafkaConstants.Fraud.RESPONSE_TOPIC)
    }
}