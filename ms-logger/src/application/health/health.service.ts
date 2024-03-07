import { Injectable } from '@nestjs/common';
import { HealthCheckResult } from 'src/domain/health/health.model';

@Injectable()
export class HealthService {
  getHealth(): HealthCheckResult {
    return {
      status: 200,
      message: 'Server running successfully',
    };
  }
}
