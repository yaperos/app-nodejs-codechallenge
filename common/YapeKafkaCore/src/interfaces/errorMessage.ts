type TReportedBy = "ms-transaction" | "gateway" | "ms-anti-fraud" | "external";
type TErrorType = "transaction" | "unrecordedTransaction";

export interface IErrorMessage {
  errorType: TErrorType;
  transactionId?: string;
  correlationId?: string;
  reportedBy: TReportedBy;
  error: {
    message?: string;
    name?: string;
    stack?: any;
  };
  unrecordedTransaction?: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
  };
}
