import express from 'express';
import { producer } from '../config/kafka.config'; // Producer configurado anteriormente

const app = express();
app.use(express.json());

// Endpoint para crear una transacción (solo para prueba inicial)
app.post('/transactions', async (req, res) => {
    const transactionData = req.body;

    producer.send(
        [{ topic: 'transaction_created', messages: JSON.stringify(transactionData) }],
        (err, data) => {
            if (err) {
                console.error('Error al enviar evento a Kafka:', err);
                return res.status(500).json({ error: 'Error al enviar evento a Kafka' });
            }

            console.log('Evento enviado a Kafka:', data);
            res.status(201).json({ message: 'Transacción creada con éxito', data: transactionData });
        }
    );
});

// Función para iniciar el servicio
export const startTransactionService = async () => {
    app.listen(3001, () => {
        console.log('Microservicio de Transacciones escuchando en el puerto 3001');
    });
};
