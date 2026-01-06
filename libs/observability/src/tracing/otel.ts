import { trace } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

export interface TelemetryConfig {
    serviceName: string;
    serviceVersion?: string;
    otlpEndpoint?: string;
    environment?: string;
    sampling?: number;
    enabled?: boolean;
}

let sdk: NodeSDK | null = null;

export function initializeTelemetry(config: TelemetryConfig): NodeSDK | null {
    if (sdk) {
        console.warn('⚠️  OpenTelemetry SDK already initialized');
        return sdk;
    }

    const {
        serviceName,
        serviceVersion = '1.0.0',
        otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318',
        environment = process.env.NODE_ENV || 'development',
        sampling = parseFloat(process.env.OTEL_SAMPLING_RATIO || '1.0'),
        enabled = process.env.OTEL_ENABLED !== 'false',
    } = config;

    if (!enabled) {
        console.log('📊 OpenTelemetry is disabled');
        return null;
    }

    const resource = new Resource({
        [ATTR_SERVICE_NAME]: serviceName,
        [ATTR_SERVICE_VERSION]: serviceVersion,
        'deployment.environment': environment,
    });

    const traceExporter = new OTLPTraceExporter({
        url: `${otlpEndpoint}/v1/traces`,
        headers: {},
    });

    const metricExporter = new OTLPMetricExporter({
        url: `${otlpEndpoint}/v1/metrics`,
        headers: {},
    });

    sdk = new NodeSDK({
        resource,
        traceExporter,
        metricReader: new PeriodicExportingMetricReader({
            exporter: metricExporter,
            exportIntervalMillis: 60000,
        }),
        instrumentations: [
            getNodeAutoInstrumentations({
                // Auto-instrumenta HTTP, Express, Kafka, PostgreSQL, etc.
                '@opentelemetry/instrumentation-http': {
                    ignoreIncomingRequestHook: (req) => {
                        const ignorePaths = ['/health', '/metrics', '/ready'];
                        return ignorePaths.some((path) => req.url?.startsWith(path));
                    },
                    requestHook: (span, request) => {
                        if (request.socket?.remoteAddress) {
                            span.setAttribute('http.client_ip', request.socket.remoteAddress);
                        }
                    },
                },
                // Deshabilitar instrumentaciones que no necesites
                '@opentelemetry/instrumentation-fs': {
                    enabled: false,
                },
            }),
        ],

        sampler:
            sampling < 1.0
                ? {
                      shouldSample: () => {
                          return Math.random() < sampling ? { decision: 1 } : { decision: 0 };
                      },
                      toString: () => `CustomSampler{${sampling}}`,
                  }
                : undefined,
    });

    sdk.start();

    console.log(`🚀 OpenTelemetry initialized for service: ${serviceName}`);
    console.log(`📡 Exporting traces to: ${otlpEndpoint}`);
    console.log(`🎲 Sampling ratio: ${sampling * 100}%`);

    const shutdown = async () => {
        try {
            if (sdk) {
                await sdk.shutdown();
                console.log('✅ OpenTelemetry SDK shut down successfully');
            }
        } catch (err) {
            console.error('❌ Error shutting down OpenTelemetry SDK:', err);
        }
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    return sdk;
}

export function getTracer(name: string) {
    return trace.getTracer(name);
}

export function getCurrentTraceContext(): {
    traceId: string;
    spanId: string;
    traceFlags: string;
} | null {
    const span = trace.getActiveSpan();
    if (!span) {
        return null;
    }

    const spanContext = span.spanContext();
    return {
        traceId: spanContext.traceId,
        spanId: spanContext.spanId,
        traceFlags: spanContext.traceFlags.toString(16).padStart(2, '0'),
    };
}

export async function shutdownTelemetry(): Promise<void> {
    if (sdk) {
        await sdk.shutdown();
        sdk = null;
    }
}
