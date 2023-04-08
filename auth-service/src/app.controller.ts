import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly client: ClientKafka,
  ) {}
  async onModuleInit() {
    this.client.subscribeToResponseOf('user.create');
    await this.client.connect();
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('user.create')
  async handleUserCreated(data: any) {
    console.log('User created event received', data);
    return await this.appService.createUser(data);
  }
}
