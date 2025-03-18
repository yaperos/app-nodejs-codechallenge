import express from 'express';
import transactionRoutes from './routes'; 
import { errorHandler } from './src/infrastructure/middlewares/errorMiddleware';
import './src/infrastructure/kafka/TransactionStatusConsumer';

const app = express();
app.use(express.json());

// Definir rutas
app.use('/api', transactionRoutes);

// Middelware para manejo de Errores centralizado
app.use(errorHandler);

const PORT_TRANSACTION = process.env.PORT_TRANSACTION || 3001;

app.listen(PORT_TRANSACTION, () => {
    console.log(`[TRX] Microservicio escuchando puerto ${PORT_TRANSACTION}`);
});
