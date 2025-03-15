import { createConsumer } from '../config/kafka.config';

export const startAntiFraudService = async () => {
    const consumer = createConsumer('transaction_created', 'anti-fraud-group');

    consumer.on('message', async (message) => {
        const transaction = JSON.parse(message.value.toString());

        console.log('Evento recibido en Anti-Fraude:', transaction);

        // Lógica para evaluar si se aprueba o rechaza
        const status = transaction.value > 1000 ? 'rejected' : 'approved';

        console.log(`Transacción ${transaction.id} marcada como ${status.toUpperCase()}`);
    });

    consumer.on('error', (err) => console.error('Error en el Consumer de Kafka:', err));

    console.log('Microservicio de Anti-Fraude escuchando eventos...');
};
