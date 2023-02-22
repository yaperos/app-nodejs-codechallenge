import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern } from '@nestjs/microservices';
import { AntifraudService } from '../services/antifraud.service';

@Controller()
export class AntifraudController {
  constructor(
    private readonly antifraudService: AntifraudService
  ) {}

  @MessagePattern('transaction_post_created')
  handleTransactionCreated(data: any) {

    console.log("data entrada", data);
    this.antifraudService.handleAntifraudCheck(data.value);
  }
}
