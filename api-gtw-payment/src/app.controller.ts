import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { transactionRequest } from './dto/transaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';
import { Admin } from '@nestjs/microservices/external/kafka.interface';

@Controller()
export class AppController {
  private admin: Admin;
  constructor(
    private readonly transactionService: AppService,
    @Inject('TRANSACTION_SERVICE') private readonly authClient: ClientKafka
  ) { }

  @Post('init')
  createTransaction(@Body() transactionRequest: transactionRequest) {
    return this.transactionService.createTransaction(transactionRequest)
  }

  @Get('search/:transactionId')
  searchTransaction(@Param('transactionId') transactionId) {
    return this.transactionService.searchTransaction(transactionId)
  }

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('create_transaction');
    this.authClient.subscribeToResponseOf('search_transaction');

    const kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:9092'],
    });
    this.admin = kafka.admin();
    const topics = await this.admin.listTopics();

    const topicList = [];
    const topicsToCreate = ['create_transaction', 'create_transaction.reply', 'search_transaction', 'search_transaction.reply'];

    topicsToCreate.forEach((item) => {
      if(!topics.includes(item)){
        topicList.push({
          topic: item,
          numPartitions: 10,
          replicationFactor: 1,
        });
      }
    })

    if (topicList.length) {
      await this.admin.createTopics({
        topics: topicList,
      });
    }

    
  }
}
