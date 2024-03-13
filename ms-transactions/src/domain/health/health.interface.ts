import { HealthCheckResult } from './health.model';

export interface HealthControllerInterface {
  checkHealth(): HealthCheckResult;
}

export interface HealthServiceInterface {
  getHealth(): HealthCheckResult;
}
