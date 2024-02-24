
export class TransactionUpdateDto {
  traceId: string;
  code: string;
  status: string;

  constructor(traceId: string, code: string, status: string) {
    this.code = code;
    this.traceId = traceId;
    this.status = status;
}

}
