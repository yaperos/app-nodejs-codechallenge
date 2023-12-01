export class FailureResponse {
    error?: {
        code: string
        detail: string
        field: string
    }
}

export interface MicroserviceError {
    code: string
    detail: string
    field?: string
}

export enum ErrorCode {
    InvalidRequest = 'INVALID_REQUEST_ERROR',
    InternalServerError = "INTERNAL_SERVER_ERROR",
    InvalidCredentials = 'INVALID_CREDENTIALS_ERROR',
    NotFoundError = 'NOT_FOUND_ERROR',
    ApiError = 'API_ERROR',
}

export class ErrorWithCode extends Error {
    public code: string
    constructor(message: string, code?: string) {
        super(message)
        this.code = code
    }
}

export class ApiError extends ErrorWithCode {
    constructor(message: string) {
        super(message, ErrorCode.ApiError)
    }
}

export class InvalidRequestError extends ErrorWithCode {
    constructor(message: string) {
        super(message, ErrorCode.InvalidRequest)
    }
}

export class TransactionNotFoundError extends ErrorWithCode {
    constructor() {
        super(`transaction not found`, ErrorCode.NotFoundError)
    }
}

export class SqlServerError extends ErrorWithCode {
    constructor(message: string) {
        super(message, ErrorCode.InternalServerError)
    }
}
