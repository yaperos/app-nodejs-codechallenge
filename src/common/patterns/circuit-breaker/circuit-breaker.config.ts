export interface CircuitBreakerOptions {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  rollingWindow: number;
  halfOpenRequestsAllowed: number;
  errorFilter?: (error: Error) => boolean;
  fallback?: () => unknown;
  name: string;
}

export const DEFAULT_CIRCUIT_BREAKER_OPTIONS: Partial<CircuitBreakerOptions> = {
  failureThreshold: 5,
  successThreshold: 3,
  timeout: 30000,
  rollingWindow: 60000,
  halfOpenRequestsAllowed: 3,
  errorFilter: () => true,
};

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerMetrics {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  totalRequests: number;
  rejectedRequests: number;
}