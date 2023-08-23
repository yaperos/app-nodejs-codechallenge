export abstract class GenericApiResponse<T> {
  traceId: string;
  abstract get results(): T;
}
export class GenericResponsePayloadOK {
  status: string;

  message: string;
}
