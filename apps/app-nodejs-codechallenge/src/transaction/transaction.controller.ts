import { Body, Controller, Get, Post } from "@nestjs/common";
import TransactionService from "./transaction.service";
import CreateTransactionDto from "./dto/create-transaction.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import TransactionUpdatedDto from "./dto/transaction.updated.dto";

@Controller("transactions")
export default class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  public async listTransactions() {
    return await this.transactionService.listTransactions();
  }

  @Post()
  public async createTransaction(@Body() dto: CreateTransactionDto) {
    return await this.transactionService.createTransaction(dto);
  }

  @MessagePattern("updated.transaction")
  public async catchMessage(@Payload() payload: TransactionUpdatedDto) {
    await this.transactionService.updateTransaction(payload);
  }
}
