import { startTransactionService } from './index';

startTransactionService().then(() => {
    console.log('[TRX] Microservicio de Transacciones iniciado correctamente');
}).catch((error) => {
    console.error('[TRX] Error al iniciar el Microservicio de Transacciones:', error);
    process.exit(1); 
});
