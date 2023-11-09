export interface ITransactionType {
    id: string;
    name: string;
  }
  
export interface ITransactionStatus {
    id: string;
    name: string;
  }
  
export interface ITransactionEntity{
    transactionExternalId: string;
    transactionType: ITransactionType;
    transactionStatus: ITransactionStatus;
    value: number;
    createdAt: Date;
  }
  