import { Controller, Get } from '@nestjs/common';
@Controller()
export class AppController {
  @Get('status-check')
  appStatus(): string {
    return `[TRANSACTION] Yape Ninja 🥷`;
  }
}
