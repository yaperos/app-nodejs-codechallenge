import { Body, Controller, Get, Param, Post, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'nestjs-rdkafka/dist/kafka/services/kafka.service';
import { Producer, TopicMetadata } from 'node-rdkafka';
import { ISchemaRegistry } from 'avro-schema-registry';
import { AppService } from '../services/app.service';
import { CreateTransactionRequest } from '../dto/create-transaction-request.dto';

@Controller('app')
export class AppController {
  producer: Producer;
  registry: ISchemaRegistry;
  topics: TopicMetadata;
  constructor(private readonly appService: AppService,   private readonly kafkaService: KafkaService) {
    this.producer = this.kafkaService.getProducer(); 
   }
  

  @Post('create')
  createTransaction(@Body() createTransactionRequest: CreateTransactionRequest) {
    return this.appService.createTransaction(createTransactionRequest);
  }

  @Post(':topic')
  async produce(@Param('topic') topic: string, @Body() body) {
    let evnt = body.event || body.type;
    if(body) {
      const key = evnt;
      console.log("🚀 ~ file: app.controller.ts ~ line 28 ~ AppController ~ produce ~ key", key)
      console.log("🚀 ~ file: app.controller.ts ~ line 1 ~ AppController ~ produce ~ body", body)
      console.log("🚀 ~ file: app.controller.ts ~ line 1 ~ AppController ~ produce ~ topic", topic)
      const value = Buffer.from(JSON.stringify(body.value || body));
      return this.producer.produce(topic, -1, value, key);
    }
    else {
      console.error('Topic', topic, 'Event', evnt, 'Topic and/or event not valid');
      return;
    }
  }
}
