require('dotenv').config();

import { initializeTelemetry } from '@app/observability';

initializeTelemetry({
    serviceName: 'transaction-service',
    serviceVersion: '1.0.0',
    otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318',
    environment: process.env.NODE_ENV || 'development',
    sampling: Number.parseFloat(process.env.OTEL_SAMPLING_RATIO || '1.0'),
    enabled: process.env.OTEL_ENABLED !== 'false',
});

console.log('✅ OpenTelemetry initialized for transaction-service');

import * as Sentry from '@sentry/nestjs';

if (process.env.SENTRY_ENABLED === 'true') {
    Sentry.init({
        dsn:
            process.env.SENTRY_DSN ||
            'https://355fd73ebe31d920ebd6c57263a8c28f@o4507779425435648.ingest.us.sentry.io/4510643730579456',
        environment: process.env.NODE_ENV || 'development',
        sendDefaultPii: true,
        tracesSampleRate: 1,
        integrations: [Sentry.captureConsoleIntegration()],
    });

    console.log('✅ Sentry initialized for transaction-service');
}
