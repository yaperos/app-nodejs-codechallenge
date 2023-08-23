import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

@ApiExcludeController()
@Controller('/healthcheck')
export class HealthcheckController {
  @Get()
  @HealthCheck()
  async healtcheck() {
    return {
      status: 'ok',
      message: 'Hello from challenged Yape !',
    };
  }
}
