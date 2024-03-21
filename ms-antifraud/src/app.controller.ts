import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto } from '@nestjs-microservices/shared/dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_transaction')
  handleTransactionCreate(@Payload() data: CreateTransactionDto) {
    this.appService.validateTransaction(data);
  }
}
