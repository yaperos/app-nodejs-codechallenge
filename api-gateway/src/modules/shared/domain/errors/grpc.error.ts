export class GrpcError extends Error {
  constructor(
    readonly error: string,
    readonly code: number,
    readonly messages: Array<string>,
  ) {
    super(error);
  }
}
