/** El upstream no respondió bien: red caída, 502/503/504 o timeout. Se reintenta y cuenta para el breaker. */
export class UpstreamUnavailableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UpstreamUnavailableError';
    }
}

export class UpstreamTimeoutError extends UpstreamUnavailableError {
    constructor(message: string) {
        super(message);
        this.name = 'UpstreamTimeoutError';
    }
}