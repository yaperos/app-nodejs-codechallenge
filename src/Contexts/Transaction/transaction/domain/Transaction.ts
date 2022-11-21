interface TransactionBody {
  id?: string | undefined;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string
  tranferTypeId: number;
  transactionStatus: number;
  value: number;
  createdAt: Date;
}

export class Transaction {
  private id?: string | undefined;
  private accountExternalIdDebit?: string;
  private accountExternalIdCredit?: string;
  private tranferTypeId: number;
  private transactionStatus: number;
  private value: number;
  private createdAt: Date;

  private constructor(data: TransactionBody) {
    this.id = data.id;
    this.accountExternalIdCredit = data.accountExternalIdCredit;
    this.accountExternalIdDebit = data.accountExternalIdDebit;
    this.tranferTypeId = data.tranferTypeId;
    this.transactionStatus = data.transactionStatus;
    this.value = data.value;
    this.createdAt = data.createdAt;
  }
  public static create(tranferTypeId: number, value: number, accountExternalIdDebit?: string, accountExternalIdCredit?: string): Transaction {
    return new Transaction({ accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, transactionStatus: 1, value, createdAt: new Date() })
  }
  public update(data: {
    transactionStatus: number
  }): void {
    this.transactionStatus = data.transactionStatus;
  }

  public static fromPrimitive(data: Record<string, any>): Transaction {
    return new Transaction({
      id: String(data._id),
      accountExternalIdCredit: data.accountExternalIdCredit,
      accountExternalIdDebit: data.accountExternalIdDebit,
      tranferTypeId: data.tranferTypeId,
      transactionStatus: data.transactionStatus,
      value: data.value,
      createdAt: data.createdAt
    })
  }
  public static toPrimitive(data: Transaction): Record<string, any> {
    return {
      id: data.id,
      accountExternalIdCredit: data.accountExternalIdCredit,
      accountExternalIdDebit: data.accountExternalIdDebit,
      tranferTypeId: data.tranferTypeId,
      transactionStatus: data.transactionStatus,
      value: data.value,
      createdAt: data.createdAt
    }
  }

  getId(): string {
    return this.id || '';
  }

  getStatus(): string {
    let status = 'Rejected'
    switch (this.transactionStatus) {
      case 1:
        status = 'Pending'
        break;
      case 2:
        status = 'Approved'
        break;
    }
    return status;
  }

  getValue(): number {
    return this.value;
  }

  getCreated(): Date {
    return this.createdAt;
  }

  setId(id: string) {
    this.id = id;
  }

  setStatus(transactionStatus: number) {
    this.transactionStatus = transactionStatus;
  }
}
