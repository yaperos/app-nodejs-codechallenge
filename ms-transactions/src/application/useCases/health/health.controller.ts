import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthControllerInterface } from '../../../domain/health/health.interface';
import { HealthCheckResult } from '../../../domain/health/health.model';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { buildLog } from '../../helper/buildLog';
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
    const trxId = randomUUID();
    this.loggerService.report('log', buildLog('log', trxId, 'health endpoint'));
    return this.healthService.getHealth();
  }
}
