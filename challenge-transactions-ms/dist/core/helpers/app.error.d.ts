export declare class ApplicationError extends Error {
    status?: number;
    constructor(message: string, status?: number);
}
