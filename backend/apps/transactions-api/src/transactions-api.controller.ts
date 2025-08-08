import { Controller, Get } from '@nestjs/common';

import { TransactionsApiService } from './transactions-api.service';

@Controller()
export class TransactionsApiController {
  constructor(private readonly transactionsApiService: TransactionsApiService) {}

  @Get()
  getHello(): string {
    return this.transactionsApiService.getHello();
  }
}
