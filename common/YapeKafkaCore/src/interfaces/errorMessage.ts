type TReportedBy = "ms-transaction" | "gateway" | "ms-anti-fraud" | "external";

export interface IErrorMessage {
  transactionId: string;
  reportedBy: TReportedBy;
  error: {
    message?: string;
    name?: string;
    stack?: any;
  };
}
