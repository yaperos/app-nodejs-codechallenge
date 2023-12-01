export interface TransactionBody {
  readonly id?: number | undefined;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  status: number;
  transferTypeId: TYPE;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export enum TYPE {
  'INMEDIATE' = 1,
  'DEFERED' = 2,
}
export enum STATUS {
  'REJECTED' = 0,
  'CREATED' = 1,
  'PENDING' = 2,
  'APPROVED' = 3,
}

export interface TransactionProps extends TransactionBody {}

export class Transaction {
  readonly id?: number | undefined;
  private accountExternalIdDebit?: string;
  private accountExternalIdCredit?: string;
  private status: STATUS;
  private transferTypeId: TYPE;
  private value: number;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(data: TransactionProps) {
    this.id = data.id;
    this.accountExternalIdDebit = data.accountExternalIdDebit;
    this.accountExternalIdCredit = data.accountExternalIdCredit;
    this.status = data.status;
    this.transferTypeId = data.transferTypeId;
    this.value = data.value;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  public static create(data: TransactionProps): Transaction {
    return new Transaction({
      accountExternalIdDebit: data.accountExternalIdDebit,
      accountExternalIdCredit: data.accountExternalIdCredit,
      status: data.status,
      transferTypeId: data.transferTypeId,
      value: data.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  static fromPrimitive(transaction: any): Transaction {
    return new Transaction({ id: transaction.id, ...transaction });
  }

  static toPrimitives(transaction: Transaction): any {
    return { ...transaction };
  }

  getId() {
    return this.id;
  }
  getType() {
    return this.transferTypeId;
  }
  getStatus() {
    return this.status;
  }
  getValue() {
    return this.value;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  setStatus(status: STATUS) {
    this.status = status;
    this.updatedAt = new Date();
  }
}
