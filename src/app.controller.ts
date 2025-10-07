import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {
  constructor() {}

  @Get()
  healthCheck(): string {
    return 'OK';
  }
}
