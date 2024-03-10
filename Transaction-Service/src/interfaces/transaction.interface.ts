export interface TransactionAttributes {
    id?: string;
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    tranferStatusId: number;
    value: number;
    createdAt?: Date;
  }


  export interface TransactionCreateAttributes {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
  }

  export interface TransactionGetAttributes {
    transactionExternalId: string;
    transactionType: {
        name: string;
    };
    transactionStatus:  {
        name: string;
    };
    value: number;
    createdAt?: Date;
  }


