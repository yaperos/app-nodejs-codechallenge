export class MetaInfoObject{
    status?: number;
    response?: string;
}

export class LogInfoObjectResponse {
    message: string;
    meta?: MetaInfoObject;
}