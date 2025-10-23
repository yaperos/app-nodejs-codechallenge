
export enum TRANSACTION_STATUS {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const TRANSFER_TYPES = {
  0: 'TO_USER',
  1: 'TO_BUSSINES',
  2: 'TO_WALLET'
}

export class Transaction {
   constructor(
    public readonly transactionExternalId: string,
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly tranferTypeId: number,
    public readonly transactionStatus: string,
    public readonly value: number,
    public readonly createdAt: Date
   ) {}

   get transactionType(): string {
      return TRANSFER_TYPES[this.tranferTypeId]      
   }
}

export type CreateTransaction = Omit<Transaction, 'transactionExternalId' | 'transactionStatus' | 'transactionType' | 'createdAt'>