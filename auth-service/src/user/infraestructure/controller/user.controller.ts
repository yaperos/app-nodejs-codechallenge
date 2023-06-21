import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCmd } from '../../application/create-user/create-user.cmd';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject('AUTH_SERVICE') private readonly client: ClientKafka,
  ) {}

  @MessagePattern('user.create')
  async signup(@Payload() data: any) {
    console.log('data', JSON.stringify(data));
    const userData = data;

    return this.commandBus.execute(new CreateUserCmd(userData.payload));
  }
}
