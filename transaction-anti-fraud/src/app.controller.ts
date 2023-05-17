import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

class KillDragonMessage {
  dragonId: number;
  name: string;
  heroId: number;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('any_name_i_want') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    ['transactions.created'].forEach((key) =>
      this.client.subscribeToResponseOf(`${key}`),
    );
    await this.client.connect();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
