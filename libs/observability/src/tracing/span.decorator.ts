import { type Span as OtelSpan, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';

export interface SpanOptions {
    name?: string;
    kind?: number;
    attributes?: Record<string, string | number | boolean>;
    recordException?: boolean;
}

export function Span(nameOrOptions?: string | SpanOptions) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        const className = target.constructor.name;

        descriptor.value = async function (...args: any[]) {
            const options: SpanOptions =
                typeof nameOrOptions === 'string' ? { name: nameOrOptions } : nameOrOptions || {};

            const spanName = options.name || `${className}.${propertyKey}`;
            const tracer = trace.getTracer('app-tracer');

            return tracer.startActiveSpan(
                spanName,
                {
                    kind: options.kind,
                    attributes: {
                        'code.function': propertyKey,
                        'code.class': className,
                        ...options.attributes,
                    },
                },
                async (span: OtelSpan) => {
                    try {
                        const result = await originalMethod.apply(this, args);
                        span.setStatus({ code: SpanStatusCode.OK });
                        return result;
                    } catch (error) {
                        if (options.recordException !== false) {
                            span.recordException(error);
                            span.setStatus({
                                code: SpanStatusCode.ERROR,
                                message: error.message,
                            });
                        }
                        throw error;
                    } finally {
                        span.end();
                    }
                },
            );
        };

        return descriptor;
    };
}

export function KafkaConsumerSpan(topicName: string) {
    return Span({
        name: `kafka.consume.${topicName}`,
        kind: SpanKind.CONSUMER,
        attributes: {
            'messaging.system': 'kafka',
            'messaging.destination': topicName,
            'messaging.operation': 'receive',
        },
        recordException: true,
    });
}

export function RepositorySpan(operationName: string, entityName?: string) {
    return Span({
        name: `db.${operationName}`,
        kind: SpanKind.CLIENT,
        attributes: {
            'db.system': 'postgresql',
            'db.operation': operationName,
            ...(entityName && { 'db.entity': entityName }),
        },
        recordException: true,
    });
}

export function UseCaseSpan(useCaseName: string) {
    return Span({
        name: `usecase.${useCaseName}`,
        kind: SpanKind.INTERNAL,
        attributes: {
            'code.layer': 'application',
            'code.type': 'usecase',
        },
        recordException: true,
    });
}
