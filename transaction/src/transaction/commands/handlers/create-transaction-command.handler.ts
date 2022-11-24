import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateTransactionComand } from "../create-transaction.comand";
import { TransactionService } from "../../service/transaction.service";
import { Inject, Logger } from "@nestjs/common";
import { CreateTransactionEvent } from "../../events/create-transaction.event";

@CommandHandler(CreateTransactionComand)
export class CreateTransactionCommandHandler implements ICommandHandler<CreateTransactionComand> {

  private readonly logger = new Logger(CreateTransactionCommandHandler.name);

  constructor(
    private readonly eventBus: EventBus,
    @Inject(TransactionService)
    private readonly _transactionService: TransactionService
  ) { }

  async execute(command: CreateTransactionComand): Promise<any> {
    this.logger.log("CreateTransactionCommandHandler.execute :::: Execute new transaction");
    let transactionRsDtoPromise = await this._transactionService
      .generateNewTransaction(command.transaction);

    this.logger.log("CreateTransactionCommandHandler.execute :::: Publish event CreateTransactionEvent");
    this.eventBus.publish(
      new CreateTransactionEvent(
        transactionRsDtoPromise
      ));

    this.logger.log("CreateTransactionCommandHandler.execute :::: Valid Transacion");
    return await this._transactionService.sendValidAntiFraud(transactionRsDtoPromise);
  }
}