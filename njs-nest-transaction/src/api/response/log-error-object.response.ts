import { ErrorResponse } from "./error.response";

export class MetaErrorObject {
    status: number;
    error: ErrorResponse;
}

export class LogErrorObjectResponse {
    message: string;
    meta: MetaErrorObject;
}