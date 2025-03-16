import express from 'express';
import { exec } from 'child_process';  
import transactionRoutes from './routes'; 
import { errorHandler } from './infrastructure/middlewares/errorMiddleware';
import './infrastructure/kafka/TransactionStatusConsumer';

const app = express();
app.use(express.json());

// Definir rutas
app.use('/api', transactionRoutes);

// Middelware para manejo de Errores centralizado
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Función para identificar y matar procesos que usen el puerto local
const killPortProcess = (port: number) => {
    return new Promise<void>((resolve, reject) => {
        const command = process.platform === 'win32'
            ? `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /PID %a /F`
            : `fuser -k ${port}/tcp`;

        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log(`No había ningún proceso activo en el puerto ${port}`);
                resolve();
            } else {
                console.log(`Proceso en puerto ${port} detenido.`);
                resolve();
            }
        });
    });
};

export const startTransactionService = async () => {
    try {
        await killPortProcess(Number(PORT));  // Matar procesos activos en el puerto local

        app.listen(PORT, () => {
            console.log(`Microservicio de Transacciones escuchando en el puerto ${PORT}`);
        });

    } catch (error) {
        process.exit(1);
    }
};
