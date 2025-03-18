import { startAntiFraudService } from './index';

startAntiFraudService().then(() => {
    console.log('[FRAUD] Microservicio de Anti-Fraude iniciado correctamente');
}).catch((error) => {
    console.error('[FRAUD] Error al iniciar el Microservicio de Anti-Fraude:', error);
    process.exit(1); 
});
