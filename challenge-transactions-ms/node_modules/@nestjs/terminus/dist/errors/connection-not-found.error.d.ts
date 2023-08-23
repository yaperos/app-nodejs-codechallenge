import { HealthCheckError } from '../health-check/health-check.error';
/**
 * Error which gets thrown when the connection
 * instance was not found in the application context
 * @publicApi
 */
export declare class ConnectionNotFoundError extends HealthCheckError {
    /**
     * Initializes the error
     * @param {any} cause The cause of the health check error
     *
     * @internal
     */
    constructor(cause: any);
}
