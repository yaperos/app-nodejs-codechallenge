import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('validate_transaction')
  async validateTransaction(@Payload() data: any) {
    const result = await this.appService.validateTransaction(data.transaction);
    return result;
  }
}
