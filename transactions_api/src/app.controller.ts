import { Controller, Get } from '@nestjs/common';

@Controller("api")
export class AppController {
  constructor() {}

  @Get()
  getStatus(): string {
    return "Transactions API server is running...";
  }
}
