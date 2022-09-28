import { IQuery } from '@nestjs/cqrs';

export class FindTransactionByIdQuery implements IQuery {
  constructor(readonly id: string) {}
}
