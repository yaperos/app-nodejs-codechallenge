export declare abstract class GenericApiResponse<T> {
    traceId: string;
    abstract get results(): T;
}
export declare class GenericResponsePayloadOK {
    status: string;
    message: string;
}
