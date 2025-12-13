import { startAntiFraudService } from './service/antiFraudService';

startAntiFraudService().catch((err) => {
  console.error('Error en el servicio Anti-Fraud:', err);
});
