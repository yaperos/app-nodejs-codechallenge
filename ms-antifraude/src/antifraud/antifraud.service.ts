import { Injectable } from '@nestjs/common';
import { KafkaMessage } from 'kafkajs'; // Asegúrate de importar el tipo correcto de mensaje de Kafka
import { KafkaConsumerService } from 'src/kafka/consumer.service';
import { KafkaProducerService } from 'src/kafka/producer.service';
import { TransactionDto } from './dto/TransactionDto';

@Injectable()
export class AntifraudService {

    constructor(
        private readonly kafkaConsumerService: KafkaConsumerService,
        private readonly kafkaProducerService: KafkaProducerService,
    ) {
        this.kafkaConsumerService.subscribeToTopic('transaction-emitter', this.handleAntiFraudEmitEvent.bind(this));
        }

        async handleAntiFraudEmitEvent(message: TransactionDto): Promise<void> {
            try {
                console.log('Evento recibido del tópico transaction-emitter:', message);
                const approvalThreshold = 1000;
                const { transactionExternalId: Id, value: transactionAmount } = message;
                let status = 'pending';
        
                if (transactionAmount <= approvalThreshold) {
                    status = 'approved';
                } else {
                    status = 'rejected';
                }
        
                const updatedMessage = {
                    id: Id,
                    status,
                };
                await this.kafkaProducerService.produce('topicofantrifraud', updatedMessage);
            } catch (error) {   
                console.error('Error al procesar el evento del tópico topicofantrifraud:', error);
            }
        }
        
        
        
}
