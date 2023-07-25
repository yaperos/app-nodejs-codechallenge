import { Kafka, Producer } from 'kafkajs';

export class KafkaService {
    private kafka: Kafka;
    private producer: Producer;

    constructor() {
        // Configura la conexión a Kafka
        this.kafka = new Kafka({
            clientId: 'transaction-service',
            brokers: ['localhost:9092'], // Reemplaza con la dirección y el puerto de tus brokers de Kafka
        });

        // Crea un productor Kafka
        this.producer = this.kafka.producer();
    }

    async sendMessageToKafka(topic: string, message: any): Promise<void> {
        try {
            // Conecta el productor a Kafka
            await this.producer.connect();

            // Envía el mensaje al tema especificado
            const kafkaMessage = {
                value: JSON.stringify(message),
            };

            await this.producer.send({
                topic,
                messages: [kafkaMessage],
            });
        } catch (error) {
            console.error('Error sending message to Kafka:', error);
        } finally {
            // Desconecta el productor de Kafka
            await this.producer.disconnect();
        }
    }

    bodyMessageTransaction(transaction: any) {
        return {
            transactionExternalId: transaction.transactionExternalId,
            accountExternalIdDebit: transaction.accountExternalIdDebit,
            accountExternalIdCredit: transaction.accountExternalIdCredit,
            tranferTypeId: transaction.tranferTypeId,
            value: transaction.value,
            transactionType: transaction.transactionType,
            transactionStatus: transaction.transactionStatus,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,

        }
    }
}
