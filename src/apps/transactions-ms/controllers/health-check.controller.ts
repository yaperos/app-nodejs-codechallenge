import { Controller, Get } from '@nestjs/common';
import { HealthCheckUseCase } from 'src/contexts/transactions-ms/application/health-check/health-check.usecase';

@Controller()
export class HealthCheckController {
    constructor(private readonly healthCheckUseCase: HealthCheckUseCase) {}

    @Get('/health-check')
    getHello(): string {
        return this.healthCheckUseCase.validate();
    }
}
