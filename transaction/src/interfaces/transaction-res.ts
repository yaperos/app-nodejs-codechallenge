export class TransactionRes {
  constructor(json: any) {
    this.transactionExternalId = json['id'];
    this.transactionType.name = json['transferType']['name'];
    this.transactionStatus.name = json['status']['name'];
    this.value = json['value'];
    this.createdAt = json['createdAt'];
  }

  transactionExternalId: string;
  transactionType: {
    name: string
  };
  transactionStatus: {
    name: string
  };
  value: number;
  createdAt: Date;
}