
interface ErrorBody {
    field: string;
    message: string;
}

export class BaseException extends Error {
    protected status = 500;
    protected response: ErrorBody;

    constructor() {
        super();
        this.response = {} as ErrorBody;
    }
}
