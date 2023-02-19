import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckUseCase } from 'src/contexts/transactions-ms/application/health-check/health-check.usecase';
import { HealthCheckController } from './controllers/health-check.controller';

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: '.env.transactions' })],
    controllers: [HealthCheckController],
    providers: [HealthCheckUseCase],
})
export class AppModule {}
