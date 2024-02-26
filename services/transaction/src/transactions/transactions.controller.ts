import { Controller, Get } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get("seed")
  async seedData(): Promise<string> {
    await this.transactionsService.seedData();
    return "Database seeded successfully!";
  }
}
