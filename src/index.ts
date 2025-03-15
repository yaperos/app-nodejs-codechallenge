import { startTransactionService } from './transactions-service/index';
import { startAntiFraudService } from './anti-fraud-service/index';

const start = async () => {
    try {
        await startTransactionService();
        await startAntiFraudService();
        console.log('Microservicios en ejecución...');
    } catch (err) {
        console.error('Error al iniciar los microservicios:', err);
        process.exit(1); 
    }
};

start();
