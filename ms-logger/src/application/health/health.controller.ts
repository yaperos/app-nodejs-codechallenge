import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthControllerInterface } from 'src/domain/health/health.interface';
import { HealthCheckResult } from 'src/domain/health/health.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController implements HealthControllerInterface {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  checkHealth(): HealthCheckResult {
    return this.healthService.getHealth();
  }
}
