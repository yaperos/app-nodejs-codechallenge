import express from 'express';
import transactionRoutes from './routes'; 
import { errorHandler } from './src/infrastructure/middlewares/errorMiddleware';
import { setupSwagger } from './src/infrastructure/documentation/SwaggerConfig';
import './src/infrastructure/kafka/TransactionStatusConsumer';

const app = express();
app.use(express.json());

// Definir rutas
app.use('/api', transactionRoutes);

// Middelware para manejo de Errores centralizado
app.use(errorHandler);

// Documentacion
setupSwagger(app);

const PORT_TRANSACTION = process.env.PORT_TRANSACTION || 3001;

app.listen(PORT_TRANSACTION, () => {
    console.log(`[TRX] Microservicio escuchando puerto ${PORT_TRANSACTION}`);
});
