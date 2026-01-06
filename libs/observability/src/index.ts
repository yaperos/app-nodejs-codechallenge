export { context, propagation, Span as OtelSpan, trace } from '@opentelemetry/api';
export { CompositeLoggerAdapter } from './adapters/composite-logger.adapter';
export { ConsoleLoggerAdapter } from './adapters/console-logger.adapter';
export { SentryLoggerAdapter } from './adapters/sentry-logger.adapter';
export {
    extractTraceContext,
    getTraceHeaders,
    injectTraceContext,
    withProducerSpan,
    wrapKafkaHandler,
} from './kafka/kafka-tracing.helper';
export { LoggerService } from './logger.service';
export { HttpLoggerInterceptor } from './logging/http-logger.interceptor';
export { LoggingModule } from './logging/logging.module';
export {
    createPinoLogger,
    LogContext,
    PinoLoggerService,
} from './logging/pino-logger.service';
export { ObservabilityModule } from './observability.module';
export { type ILogger, LOGGER_PORT } from './ports/logger.port';
export {
    getCurrentTraceContext,
    getTracer,
    initializeTelemetry,
    shutdownTelemetry,
    TelemetryConfig,
} from './tracing/otel';
export {
    KafkaConsumerSpan,
    RepositorySpan,
    Span,
    SpanOptions,
    UseCaseSpan,
} from './tracing/span.decorator';
export { TracingModule } from './tracing/tracing.module';
