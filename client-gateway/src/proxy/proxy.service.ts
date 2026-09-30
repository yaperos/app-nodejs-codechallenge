import type { IncomingHttpHeaders } from 'node:http';
import {
    BadGatewayException,
    GatewayTimeoutException,
    Injectable,
    Logger,
    ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    BrokenCircuitError,
    circuitBreaker,
    ConsecutiveBreaker,
    ExponentialBackoff,
    handleAll,
    handleWhen,
    type IPolicy,
    retry,
    wrap,
} from 'cockatiel';
import type { Env } from '../config/env';
import { UpstreamTimeoutError, UpstreamUnavailableError } from './upstream.errors';

export interface ForwardRequest {
    method: 'GET' | 'POST';
    path: string;
    headers: IncomingHttpHeaders;
    clientIp?: string;
    body?: unknown;
}

export interface UpstreamResponse {
    status: number;
    contentType: string | null;
    body: string;
}

// Solo estos headers cruzan el gateway (allowlist).
const FORWARDED_HEADERS = ['accept', 'idempotency-key', 'x-correlation-id', 'user-agent'] as const;
const UNAVAILABLE_STATUSES = new Set([502, 503, 504]);

@Injectable()
export class ProxyService {
    private readonly logger = new Logger(ProxyService.name);
    private readonly baseUrl: string;
    private readonly timeoutMs: number;

    private readonly breaker = circuitBreaker(handleAll, {
        halfOpenAfter: 10_000,
        breaker: new ConsecutiveBreaker(5),
    });

    // Lecturas: retry (2 reintentos con backoff) + breaker. Escrituras: solo breaker.
    private readonly readPolicy: IPolicy = wrap(
        retry(handleWhen((error) => error instanceof UpstreamUnavailableError), {
            maxAttempts: 2,
            backoff: new ExponentialBackoff({ initialDelay: 100, maxDelay: 1_000 }),
        }),
        this.breaker,
    );
    private readonly writePolicy: IPolicy = this.breaker;

    constructor(config: ConfigService<Env, true>) {
        this.baseUrl = config.get('TRANSACTION_SERVICE_URL', { infer: true }).replace(/\/+$/, '');
        this.timeoutMs = config.get('UPSTREAM_TIMEOUT_MS', { infer: true });
        this.breaker.onBreak(() => this.logger.error('transaction-service circuit OPEN'));
        this.breaker.onHalfOpen(() => this.logger.warn('transaction-service circuit HALF-OPEN'));
        this.breaker.onReset(() => this.logger.log('transaction-service circuit CLOSED'));
    }

    async forward(request: ForwardRequest): Promise<UpstreamResponse> {
        const policy = request.method === 'GET' ? this.readPolicy : this.writePolicy;
        try {
            return await policy.execute(() => this.call(request));
        } catch (error) {
            throw this.toHttpException(error);
        }
    }

    /** Para el health agregado: no pasa por el breaker. */
    async ping(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/health/ready`, {
                signal: AbortSignal.timeout(1_000),
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    private async call(request: ForwardRequest): Promise<UpstreamResponse> {
        const hasBody = request.body !== undefined;
        let response: Response;
        let body: string;
        try {
            response = await fetch(`${this.baseUrl}${request.path}`, {
                method: request.method,
                headers: this.buildHeaders(request, hasBody),
                body: hasBody ? JSON.stringify(request.body) : undefined,
                signal: AbortSignal.timeout(this.timeoutMs), // cubre conexión + lectura del body
            });
            if (UNAVAILABLE_STATUSES.has(response.status)) {
                throw new UpstreamUnavailableError(`Upstream responded ${response.status}`);
            }
            body = await response.text();
        } catch (error) {
            if (error instanceof UpstreamUnavailableError) throw error;
            if ((error as Error).name === 'TimeoutError') {
                throw new UpstreamTimeoutError(`Upstream did not respond within ${this.timeoutMs}ms`);
            }
            throw new UpstreamUnavailableError(`Upstream unreachable: ${(error as Error).message}`);
        }
        // 4xx y 500 son respuestas válidas del servicio: se devuelven tal cual.
        return { status: response.status, contentType: response.headers.get('content-type'), body };
    }

    private buildHeaders(request: ForwardRequest, hasBody: boolean): Record<string, string> {
        const headers: Record<string, string> = {};
        for (const name of FORWARDED_HEADERS) {
            const value = request.headers[name];
            if (typeof value === 'string') headers[name] = value;
        }
        if (request.clientIp) headers['x-forwarded-for'] = request.clientIp;
        if (hasBody) headers['content-type'] = 'application/json';
        return headers;
    }

    private toHttpException(error: unknown): unknown {
        if (error instanceof BrokenCircuitError) {
            return new ServiceUnavailableException('transaction-service is temporarily unavailable');
        }
        if (error instanceof UpstreamTimeoutError) {
            return new GatewayTimeoutException('transaction-service timed out');
        }
        if (error instanceof UpstreamUnavailableError) {
            return new BadGatewayException('transaction-service is not reachable');
        }
        return error;
    }
}