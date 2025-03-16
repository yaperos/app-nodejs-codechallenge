import { producer } from '../../../config/kafka.config';

export const publishTransactionCreated = (transactionData: any) => {
    producer.send(
        [
            {
                topic: 'transaction_created', 
                messages: [JSON.stringify(transactionData)],
            }
        ],
        (err, data) => {
            if (err) {
                console.error(`Error al enviar evento a Kafka:`, err);
            } else {
                console.log(`Evento enviado correctamente al topic 'transaction_created':`, data);
            }
        }
    );
};
