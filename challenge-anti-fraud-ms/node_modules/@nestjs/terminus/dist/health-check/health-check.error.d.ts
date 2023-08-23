export declare class HealthCheckError extends Error {
    causes: any;
    isHealthCheckError: boolean;
    constructor(message: string, causes: any);
}
