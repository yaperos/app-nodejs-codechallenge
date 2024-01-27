import { Controller, Get } from '@nestjs/common';
import { ApiTransactionsService } from './api-transactions.service';

@Controller()
export class ApiTransactionsController {
  constructor(private readonly apiTransactionsService: ApiTransactionsService) {}

  @Get()
  getHello(): string {
    return this.apiTransactionsService.getHello();
  }
}
