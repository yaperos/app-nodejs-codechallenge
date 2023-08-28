import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { KafkaEnum } from 'apps/shared/enum/kafka-config.enum';
import { AppService } from './app.service';
import { CreateTransctionDto } from './dto/create-transaction.dto';

@ApiTags('Transactions')
@Controller()
export class AppController {

  constructor(private appService: AppService) {}
  
  @Get('list-transaction')
  async listTransaction() {
    try {
      return this.appService.getTransaction();
    } catch (e) {
      console.log('error -------', e)
    }
  }

  @Post('create-transaction')
  async createTransaction(@Body() body: CreateTransctionDto) {
    try {
      return this.appService.createTransaction(body);
    } catch (e) {
      console.log('error -------', e)
    }
  }
}
