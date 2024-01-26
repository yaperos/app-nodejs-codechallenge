type TReportedBy = 'ms-transaction' | 'gateway' | 'ms-anti-fraud' | 'external'
interface IErrorMessageBase {
  reportedBy: TReportedBy;
  error: {
    message?: string;
    name?: string;
    stack?: any;
  };
}

interface IErrorMessageWithTransactionId extends IErrorMessageBase {
  transactionId: string;
  correlationId?: never;
}

interface IErrorMessageWithCorrelationId extends IErrorMessageBase {
  transactionId?: never;
  correlationId: string;
}

export type IErrorMessage = IErrorMessageWithTransactionId | IErrorMessageWithCorrelationId;

