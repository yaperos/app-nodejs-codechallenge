import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HealthCheckUseCase } from '../../../contexts/transactions-ms/transaction/application/health-check/health-check.usecase';

@ApiTags('Health Check')
@Controller()
export class HealthCheckController {
    constructor(private readonly healthCheckUseCase: HealthCheckUseCase) {}

    @Get('/health-check')
    validate(): string {
        return this.healthCheckUseCase.validate();
    }
}
