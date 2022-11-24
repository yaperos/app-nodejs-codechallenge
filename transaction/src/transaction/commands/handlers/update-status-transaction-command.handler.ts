import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { TransactionService } from "../../service/transaction.service";
import { Inject, Logger } from "@nestjs/common";
import { UpdateTransactionComand } from "../update-transaction.comand";
import { UpdateStatusTransactionEvent } from "../../events/update-status-transaction.event";

@CommandHandler(UpdateTransactionComand)
export class UpdateStatusTransactionCommandHandler implements ICommandHandler<UpdateTransactionComand> {

  private readonly logger = new Logger(UpdateStatusTransactionCommandHandler.name);

  constructor(
    private readonly eventBus: EventBus,
    @Inject(TransactionService)
    private readonly _transactionService: TransactionService
  ) {
  }

  async execute(command: UpdateTransactionComand): Promise<any> {
    this.logger.log("UpdateStatusTransactionCommandHandler.execute :::: Update Status Transaction ");
    await this._transactionService
      .updateStatusTransaction(command.transaction);
    this.logger.log("UpdateStatusTransactionCommandHandler.execute :::: Publish Event Update Status in Read Database");
    this.eventBus.publish(
      new UpdateStatusTransactionEvent(
        command.transaction
      ));
  }

}