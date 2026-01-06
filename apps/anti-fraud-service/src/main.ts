import 'reflect-metadata';
import './config/instrument';
import { CorrelationIdInterceptor } from '@app/common';
import { HttpLoggerInterceptor, PinoLoggerService, shutdownTelemetry } from '@app/observability';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AntiFraudModule } from './anti-fraud.module';

async function bootstrap() {
    const app = await NestFactory.create(AntiFraudModule, {
        bufferLogs: true,
    });
    const logger = app.get(PinoLoggerService);
    app.useLogger(logger);
    app.useGlobalInterceptors(new CorrelationIdInterceptor());
    app.useGlobalInterceptors(new HttpLoggerInterceptor(logger));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.enableCors();
    const port = process.env.ANTI_FRAUD_PORT || 3001;
    await app.listen(port);
    logger.log(`🛡️  Anti-Fraud Service running on http://localhost:${port}`, {
        port,
        environment: process.env.NODE_ENV,
    });
    process.on('SIGTERM', async () => {
        logger.log('SIGTERM signal received: closing HTTP server');
        await app.close();
        await shutdownTelemetry();
        process.exit(0);
    });
    process.on('SIGINT', async () => {
        logger.log('SIGINT signal received: closing HTTP server');
        await app.close();
        await shutdownTelemetry();
        process.exit(0);
    });
}

bootstrap();
