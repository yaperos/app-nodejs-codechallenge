import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern } from '@nestjs/microservices';
import { AntifraudService } from '../services/antifraud.service';

@Controller()
export class AntifraudController {
  constructor(
    private readonly antifraudService: AntifraudService
  ) {}

  @EventPattern('ahua')
  handleAntifraud(data: any) {

    console.log("YEAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
    console.log("data entrada", data);
    this.antifraudService.handleAntifraudCheck(data.value);
  }
}
