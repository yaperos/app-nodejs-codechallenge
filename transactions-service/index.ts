import express from 'express';
import transactionRoutes from './routes'; 
import { errorHandler } from './infrastructure/middlewares/errorMiddleware';
import './infrastructure/kafka/TransactionStatusConsumer';

const app = express();
app.use(express.json());

// Definir rutas
app.use('/api', transactionRoutes);

// Middelware para manejo de Errores centralizado
app.use(errorHandler);

const PORT_TRANSACTION = process.env.PORT_TRANSACTION || 3001;

export const startTransactionService = async () => {
    try {
        app.listen(PORT_TRANSACTION, () => {
            console.log(`[TRX] Microservicio escuchando puerto ${PORT_TRANSACTION}`);
        });

    } catch (error) {
        process.exit(1);
    }
};
