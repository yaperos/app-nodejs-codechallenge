import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CreateTransactionEvent } from "../create-transaction.event";
import { TransactionReadService } from "../../service/transaction-read.service";
import { Inject, Logger } from "@nestjs/common";

@EventsHandler(CreateTransactionEvent)
export class CreateTransactionEventHandler implements IEventHandler<CreateTransactionEvent> {

  private readonly logger = new Logger(CreateTransactionEventHandler.name);

  constructor(
    @Inject(TransactionReadService)
    private readonly _transactionReadService: TransactionReadService
  ) {
  }

  handle(event: CreateTransactionEvent): any {
    this.logger.log("CreateTransactionEventHandler.handle :::: Insert Transaction in READ DATABASE");
    let transaction = event.transaction;
    this._transactionReadService.insert(
      transaction
    ).then(r =>
      this.logger.log("CreateTransactionEventHandler.handle :::: Transaction update success"));
  }

}