import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('transactions')
export class AppController {
  constructor(private readonly appService: AppService,) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.appService.createTransaction(createTransactionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appService.findTransaction(id);
  }

  @EventPattern('transaction_status_updated')
  async handleTransactionStatusUpdated(@Payload() message: any) {
    const data = message.value ? message.value : message;
    
    console.log(`Update Request Received for: ${data.transactionExternalId} with status ${data.status}`);
    
    await this.appService.updateStatus(data.transactionExternalId, data.status);
  }
}
