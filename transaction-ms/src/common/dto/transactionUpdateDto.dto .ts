
export class TransactionUpdateDto {
  traceId: string;
  code: string;
  status: string;

  constructor(traceId: string, code: string, status: string) {
    this.traceId = traceId
    this.code = code;
    this.status = status;
}

}
