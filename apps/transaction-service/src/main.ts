import 'reflect-metadata';
import './config/instrument';
import { CorrelationIdInterceptor } from '@app/common';
import { HttpLoggerInterceptor, PinoLoggerService, shutdownTelemetry } from '@app/observability';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TransactionModule } from './transaction.module';

async function bootstrap() {
    const app = await NestFactory.create(TransactionModule, {
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
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`🚀 Transaction Service running on http://localhost:${port}`, {
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
