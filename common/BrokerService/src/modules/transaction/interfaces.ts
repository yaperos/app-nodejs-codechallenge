interface ITransactionFields {
  transactionExternalId: string;
  "transactionType.name": string;
  "transactionStatus.name": string;
  value: string;
  createdAt: string;
}

type TSortOrder = "ASC" | "DESC";

interface ITransactionFilterOptions {
  transactionExternalId?: string;
  "transactionType.name"?: string;
  "transactionStatus.name"?: string;
  value?: string;
  createdAt?: string;
}

interface IGetTransactionsOptions {
  limit?: number;
  page?: number;
  sortBy?: `${keyof ITransactionFields},${TSortOrder}`;
  filterBy?: ITransactionFilterOptions;
  fields?: Array<keyof ITransactionFields>;
}

interface IFormattedTransaction {
  transactionExternalId?: string;
  transactionType?: {
    name: string;
  };
  transactionStatus?: {
    name: string;
  };
  value?: string;
  createdAt?: string;
}

interface IHATEOASLinks {
  self: string;
  first: string | null;
  prev: string | null;
  next: string | null;
  last: string | null;
  total: number;
}

interface ITransactionsResponse {
  data: IFormattedTransaction[];
  links: IHATEOASLinks;
}

export { ITransactionsResponse, IGetTransactionsOptions };
