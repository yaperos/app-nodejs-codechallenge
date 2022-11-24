import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post } from "@nestjs/common";
import { NewTransactionRqDto } from "../dto/new-transaction-rq.dto/new-transaction-rq.dto";
import { TransactionService } from "../service/transaction.service";
import { Ctx, KafkaContext, MessagePattern, Payload } from "@nestjs/microservices";
import { AntiFraudResponseDto } from "../dto/anti-fraud-response.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { FindTransactionQuery } from "../queries/find-transaction.query";
import { CreateTransactionComand } from "../commands/create-transaction.comand";
import { UpdateTransactionComand } from "../commands/update-transaction.comand";

@Controller()
export class TransactionController {

  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly service: TransactionService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {
  }

  @Post("/transaction")
  async sendTransaction(@Body() newTransaction: NewTransactionRqDto) {
    this.logger.log("TransactionController.sendTransaction :::: SEND NEW TRANSACTION ");
    try {
      return await this.commandBus.execute(new CreateTransactionComand(newTransaction));
    } catch (errors) {
      this.logger.error("TransactionController.sendTransaction", errors);
    }
  }

  @MessagePattern("response-anti-fraud")
  async updateStatusTransaction(@Payload() antiFraudResponseDto: AntiFraudResponseDto, @Ctx() context: KafkaContext) {
    this.logger.log("TransactionController.updateStatusTransaction :::: Update Status transaction: ", antiFraudResponseDto.status);
    try {
      return await this.commandBus.execute(new UpdateTransactionComand(antiFraudResponseDto));
    } catch (errors) {
      this.logger.error("TransactionController.updateStatusTransaction", errors);
    }
  }

  @Get("/transaction/:id")
  async findById(@Param("id") id) {
    return await this.queryBus.execute(
      new FindTransactionQuery(id)
    );
  }

  @Get("/transaction")
  async findAll() {
    return await this.queryBus.execute(
      new FindTransactionQuery());
  }

}
