import { Controller, Logger } from '@nestjs/common';

import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntifraudRequest } from '@app-nodejs-codechallenge/core-lib';
@Controller()
export class AppController {
  logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @MessagePattern('fibo')
  validateTransaction(@Payload() message: AntifraudRequest) {
    this.logger.log(`Verifying transfer ${JSON.stringify(message)}`);
    return this.appService.validateTransaction(message);
  }
}
