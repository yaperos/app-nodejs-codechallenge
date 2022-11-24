import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindTransactionQuery } from "../find-transaction.query";
import { TransactionReadService } from "../../service/transaction-read.service";

@QueryHandler(FindTransactionQuery)
export class FindTransactionQueryHandler implements IQueryHandler<FindTransactionQuery> {

  constructor(
    private readonly _transactionReadService: TransactionReadService
  ) { }

  async execute(query: FindTransactionQuery): Promise<any> {
    if(query.id)
      return this._transactionReadService.findOne(query.id);
    return this._transactionReadService.findAll();
  }

}