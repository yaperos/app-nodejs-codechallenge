import { IQuery } from "@nestjs/cqrs";

export interface GetTransactionDTO {
  transactionExternalId: string;
}

export class GetTransactionQuery implements IQuery {
  constructor(public readonly getTransactionDTO: GetTransactionDTO) {}
}
