import { Injectable } from '@nestjs/common';
import { HealthServiceInterface } from '../../../domain/health/health.interface';
import { HealthCheckResult } from '../../../domain/health/health.model';

@Injectable()
export class HealthService implements HealthServiceInterface {
  getHealth(): HealthCheckResult {
    return {
      status: 200,
      message: 'Server running successfully',
    };
  }
}
