export class TransactionResponse {

  transactionExternalId: string;
  transactionType: BaseModel;
  transactionStatus: BaseModel;
  value: number;
  createdAt: Date;
}

export class BaseModel {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
