import { Transaction } from "../../../../../Shared/types/transaction";
import { TransactionRepository } from "../../../domain/repositories/TransactionRepository";
import { Logger
 } from "../../../../../Shared/infrastructure/Logger";
import KafkaProducerService from "../../../../../Shared/infrastructure/kafka/sendMessage";

export class TransactionStatus {   

    private transactionRepository: TransactionRepository;
    private logger: Logger;
    private kafkaProducer: KafkaProducerService; 

    constructor(transactionRepository: TransactionRepository, logger: Logger, kafkaProducer: KafkaProducerService) {
        this.transactionRepository = transactionRepository;
        this.logger = logger;
        this.kafkaProducer = kafkaProducer; 
    }

    async newTransactionEvent(payload: Transaction) {
        const createdTransaction = await this.transactionRepository.createTransaction(payload);
        if (createdTransaction.success === true) {
            try {
                const kafkaMessage = {
                    event: "TransactionCreated",
                    data: createdTransaction.data,
                };
                this.logger.debug('Transaction creation event sent to Kafka topic.');
                await this.kafkaProducer.sendToKafkaService(kafkaMessage);
            } catch (error) {
                this.logger.error(`Error sending message to Kafka topic: ${error}`);
            }
        } else {
            this.logger.debug('Transaction creation failed, not sending event to Kafka.');
        }
    }
}