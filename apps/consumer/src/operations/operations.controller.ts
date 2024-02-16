import { Body, Controller } from "@nestjs/common";
import OperationsService from "./operations.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import TransactionInDto from "./dto/transaction.in.dto";

@Controller("operations")
export default class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @MessagePattern("created.transaction")
  public async catchMessage(@Body() @Payload() payload: TransactionInDto) {
    return await this.operationsService.processTransactions(payload);
  }
}
