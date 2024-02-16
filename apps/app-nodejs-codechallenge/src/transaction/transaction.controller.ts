import { Controller, Get } from "@nestjs/common";
import TransactionService from "./transaction.service";

@Controller("transactions")
export default class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  public async listTransactions() {
    return await this.transactionService.listTransactions();
  }
}
