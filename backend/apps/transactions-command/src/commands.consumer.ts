import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, Payload } from "@nestjs/microservices";
import { type TransactionCommand, TransactionCommandTypeEnum } from "@shared/contracts";
import { commitOffset } from "@shared/messaging";
import { Topics } from "@shared/messaging/topics";
import { CommandsService } from "apps/transactions-command/src/commands.service";

@Injectable()
export class CommandsConsumer {
  constructor(private readonly commandsService: CommandsService) {}

  @EventPattern(Topics.TransactionCommands)
  async handleTransactionCommand(@Payload() payload: TransactionCommand, @Ctx() context: KafkaContext) {
    const type = payload.type;
    
    switch (type) {
      case TransactionCommandTypeEnum.CREATE_TRANSACTION:
        await this.commandsService.createTransaction(payload);
        break;
      case TransactionCommandTypeEnum.VALIDATE_TRANSACTION:
        await this.commandsService.validateTransaction(payload);
        break;
      default:
        throw new UnprocessableEntityException(`Unknown command type: ${type}`);
    }

    await commitOffset(context);
  }
}