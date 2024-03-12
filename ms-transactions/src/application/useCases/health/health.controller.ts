import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthControllerInterface } from '../../../domain/health/health.interface';
import { HealthCheckResult } from '../../../domain/health/health.model';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { randomUUID } from 'crypto';

@ApiTags('Health')
@Controller('health')
export class HealthController implements HealthControllerInterface {
  constructor(
    private readonly healthService: HealthService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  checkHealth(): HealthCheckResult {
    this.loggerService.report('log', { mission: 'health' }, randomUUID());
    return this.healthService.getHealth();
  }
}
