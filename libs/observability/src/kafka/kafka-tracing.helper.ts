import { context, propagation, type Span, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import type { EachMessagePayload } from 'kafkajs';

export function injectTraceContext(headers: Record<string, any> = {}): Record<string, any> {
    const activeContext = context.active();

    propagation.inject(activeContext, headers, {
        set: (carrier, key, value) => {
            carrier[key] = value;
        },
    });

    return headers;
}

export function extractTraceContext(headers: Record<string, any> = {}): any {
    return propagation.extract(context.active(), headers, {
        get: (carrier, key) => {
            const value = carrier[key];
            if (Array.isArray(value)) {
                return value[0]?.toString();
            }
            return value?.toString();
        },
        keys: (carrier) => Object.keys(carrier),
    });
}

export function wrapKafkaHandler(
    topicName: string,
    handler: (payload: EachMessagePayload) => Promise<void>,
): (payload: EachMessagePayload) => Promise<void> {
    return async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        const tracer = trace.getTracer('kafka-consumer');

        const extractedContext = extractTraceContext(message.headers || {});

        return context.with(extractedContext, async () => {
            return tracer.startActiveSpan(
                `kafka.consume.${topicName}`,
                {
                    kind: SpanKind.CONSUMER,
                    attributes: {
                        'messaging.system': 'kafka',
                        'messaging.destination': topic,
                        'messaging.operation': 'receive',
                        'messaging.kafka.partition': partition,
                        'messaging.kafka.offset': message.offset,
                        'messaging.message_id': message.key?.toString(),
                    },
                },
                async (span: Span) => {
                    try {
                        await handler(payload);

                        span.setStatus({ code: SpanStatusCode.OK });
                    } catch (error) {
                        span.recordException(error);
                        span.setStatus({
                            code: SpanStatusCode.ERROR,
                            message: error.message,
                        });

                        throw error;
                    } finally {
                        span.end();
                    }
                },
            );
        });
    };
}

export async function withProducerSpan<T>(
    topicName: string,
    messageKey: string,
    handler: () => Promise<T>,
): Promise<T> {
    const tracer = trace.getTracer('kafka-producer');

    return tracer.startActiveSpan(
        `kafka.produce.${topicName}`,
        {
            kind: 4,
            attributes: {
                'messaging.system': 'kafka',
                'messaging.destination': topicName,
                'messaging.operation': 'send',
                'messaging.message_id': messageKey,
            },
        },
        async (span: Span) => {
            try {
                const result = await handler();
                span.setStatus({ code: SpanStatusCode.OK });
                return result;
            } catch (error) {
                span.recordException(error);
                span.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: error.message,
                });
                throw error;
            } finally {
                span.end();
            }
        },
    );
}

export function getTraceHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    injectTraceContext(headers);
    return headers;
}
