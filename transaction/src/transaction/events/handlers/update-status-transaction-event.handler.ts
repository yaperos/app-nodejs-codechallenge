import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { TransactionReadService } from "../../service/transaction-read.service";
import { UpdateStatusTransactionEvent } from "../update-status-transaction.event";


@EventsHandler(UpdateStatusTransactionEvent)
export class UpdateStatusTransactionEventHandler implements IEventHandler<UpdateStatusTransactionEvent> {

  private readonly logger = new Logger(UpdateStatusTransactionEventHandler.name);

  constructor(
    @Inject(TransactionReadService)
    private readonly _transactionReadService: TransactionReadService
  ) {
  }

  handle(event: UpdateStatusTransactionEvent): any {
    this._transactionReadService.updateStatus(event.transaction);
    this.logger.log("UpdateStatusTransactionEventHandler.handle :::: SUCCESS Update Status transaction in READ DATABASE ");

  }

}