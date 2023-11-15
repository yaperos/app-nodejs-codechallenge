export class CustomErrorResponse extends Error {
    constructor(public status: number, message: string) {
        super(message)
        this.status = status
    }
}

export class UnauthorizedError extends CustomErrorResponse {
    constructor(message = 'Unauthorized') {
        super(401, message)
    }
}

export class ForbiddenError extends CustomErrorResponse {
    constructor(message = 'Forbidden') {
        super(403, message)
    }
}

export class NotFoundError extends CustomErrorResponse {
    constructor(message = 'Not Found') {
        super(404, message)
    }
}

export class InternalServerError extends CustomErrorResponse {
    constructor(message = 'Internal Server Error') {
        super(500, message)
    }
}

export class BadRequestError extends CustomErrorResponse {
    constructor(message = 'Bad Request') {
        super(400, message)
    }
}
