export class ResponseGetTransactionDto {
  'transactionExternalId': string;
  'transactionType': {
    name: string;
  };
  'transactionStatus': {
    name: string;
  };
  'value': number;
  'createdAt': Date;
}
