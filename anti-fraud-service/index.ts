import express from 'express';
import './src/infrastructure/kafka/TransactionConsumer';

const app = express();
const PORT_FRAUD = process.env.PORT_FRAUD || 3001;

export const startAntiFraudService = async () => {
    try {
        app.listen(PORT_FRAUD, () => {
            console.log(`[ATF] Microservicio escuchando puerto ${PORT_FRAUD}`);
        });

    } catch (error) {
        process.exit(1);
}};
