import { Controller, Inject, Post } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDTO } from '../dto/user.register.dto';
import {CommandBus} from "@nestjs/cqrs";
import {CreateUserCommand} from "../../application/create-user/create-user.cmd";

@Controller('user')
export class UserController {
  constructor(
    //private readonly userService: ,
    //@Inject('AUTH_SERVICE') private readonly client: ClientKafka,
    private readonly commandBus: CommandBus,
  ) {}

  @MessagePattern('user.create')
  async signup(@Payload() data: any) {
    const userData = data.payload;

    await this.commandBus.execute(new CreateUserCommand(userData));

    return {
      requestId: data.payload.requestID,
      statusCode: 200,
      data: 'User created',
    }
/*
    const user = await this.userService.createUser(userData);
    if (user.value.isSuccess) {
      this.client.emit('user.create.completed', {
        userID: user.value._value.id,
      });
    }
    const responseData = {
      userID: user.value._value.id,
      userStatus: user.value._value.status,
    };
    return {
      requestId: data.payload.requestID,
      statusCode: user.value.isSuccess ? 200 : 400,
      data: user.value.isSuccess ? responseData : 'An error occurred',
    };
*/
  }
}
