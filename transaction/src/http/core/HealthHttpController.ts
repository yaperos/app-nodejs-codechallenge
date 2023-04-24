import {
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { HealthCheckService, MemoryHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { INFO_RESPONSES } from '../../config/constants/response';

@Controller('')
export class HealthHttpController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get('/status/healthy')
  @HealthCheck()
  async status() {
    const healthCheckResult = await this.health.check([
      // The process should not use more than 256MB memory
      () => this.memory.checkHeap('memory_heap', 256 * 1024 * 1024),
    ]);

    if (!healthCheckResult || Object.keys(healthCheckResult.error).length > 0) {
      throw new InternalServerErrorException({
        message: INFO_RESPONSES.HEALTHCHECK_FAILED,
      });
    }
    return {
      message: healthCheckResult.details,
      status: HttpStatus.OK,
    };
  }
}
