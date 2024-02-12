import { AntiFraud } from '../model/anti-fraud.model';

export interface AntiFraudRepository {
  checkTransaction(antiFraud: AntiFraud): Promise<unknown>;
}
