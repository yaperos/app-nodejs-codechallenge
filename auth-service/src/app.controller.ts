import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, // @Inject('AUTH_SERVICE') private readonly client: ClientKafka,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern('user.create')
  async handleUserCreated(@Payload() data: any) {
    console.log('User created event received', data);
    const res = {
      requestId: data.requestId,
      completed: true,
    };
    return res;
  }
}
