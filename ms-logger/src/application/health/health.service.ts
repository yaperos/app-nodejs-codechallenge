import { Injectable } from '@nestjs/common';
import { HealthServiceInterface } from 'src/domain/health/health.interface';
import { HealthCheckResult } from 'src/domain/health/health.model';

@Injectable()
export class HealthService implements HealthServiceInterface {
  getHealth(): HealthCheckResult {
    return {
      status: 200,
      message: 'Server running successfully',
    };
  }
}
