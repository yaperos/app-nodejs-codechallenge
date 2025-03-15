import express from 'express';
import transactionRoutes from './routes'; 
import { errorHandler } from './infrastructure/middlewares/errorMiddleware';

const app = express();
app.use(express.json());

// Definir rutas
app.use('/api', transactionRoutes);

// Middelware para manejo de Errores centralizado
app.use(errorHandler);

export const startTransactionService = async () => {
    app.listen(3001, () => {
        console.log('Microservicio de Transacciones escuchando en el puerto 3001');
    });
};
