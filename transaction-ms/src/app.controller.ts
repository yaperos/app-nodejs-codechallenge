import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateFraudStatusDto } from './dto/update-fraud-status.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('transaction-create')
  create(@Payload() createTransactionDto: CreateTransactionDto) {
    return this.appService.create(createTransactionDto);
  }

  @MessagePattern('transaction-get')
  findOne(@Payload() transactionExternalId: string) {
    return this.appService.findOne(transactionExternalId);
  }

  @MessagePattern('transaction-get-all')
  findAll() {
    return this.appService.findAll();
  }

  @EventPattern('transaction-update-fraud-status')
  update(@Payload() { transactionId, isFraud }: UpdateFraudStatusDto) {
    return this.appService.updateFraudStatus(transactionId, isFraud);
  }
}
