export class TransactionCreatedDto {
  uuid: string;
  value: number;
  transactionStatus: {
    name: string;
  };
}
