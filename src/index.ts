import { startTransactionService } from './transactions-service/index';
import { startAntiFraudService } from './anti-fraud-service/index';

const start = async () => {
    try {
        await startTransactionService();
        await startAntiFraudService();
    } catch (err) {
        process.exit(1); 
    }
};

start();
