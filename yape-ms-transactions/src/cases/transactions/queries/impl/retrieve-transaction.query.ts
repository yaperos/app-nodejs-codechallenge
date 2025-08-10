import { RetrieveTransactionDto } from '../../dtos';

export class RetrieveTransactionQuery {
  constructor(public readonly payload: RetrieveTransactionDto) {}
}
