import { HealthCheckResult } from './health.model';

export interface HealthServiceInterface {
  checkHealth(): HealthCheckResult;
}
