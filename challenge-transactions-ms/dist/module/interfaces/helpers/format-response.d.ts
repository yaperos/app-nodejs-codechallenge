import { GenericResponsePayloadOK } from './generic-api-response';
export declare abstract class FormatResponse {
    abstract standard(results: any, traceId: string): Record<string, any>;
    abstract paginated(traceId: string, page: number, total: number, results: any): Record<string, any>;
    abstract getGenericResponseOK(traceId: string): Record<string, any>;
    abstract get GENERIC_RESPONSE_OK(): GenericResponsePayloadOK;
}
