import { SearchTransactionRequest } from '../../dtos/search-transaction.dto';

export class SearchTransactionQuery {
  constructor(
    public readonly searchTransactionRequest: SearchTransactionRequest,
  ) {}
}
