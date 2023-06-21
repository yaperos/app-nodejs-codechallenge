import {Controller, Inject, Post} from '@nestjs/common';
import {ClientKafka, MessagePattern, Payload} from '@nestjs/microservices';
import {CreateUserDTO} from '../dto/user.register.dto';
import {CommandBus} from "@nestjs/cqrs";
import {CreateUserCommand} from "../../application/create-user/create-user.cmd";
import {Result} from "../../../shared/core/result";
import {User} from "../../domain/user";
import {AuthUserCommand} from "../../application/auth-user/auth-user.cmd";
import {AuthVerifyCommand} from "../../application/auth-verify/auth-verify.cmd";

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
  }

  @MessagePattern('user.login')
  async login(@Payload() data: any) {
    let response = {
      requestId: data.payload.requestID,
      statusCode: 400,
      data: null
    }

    console.log('[LOGIN REQUEST]: ', data)
    const res = await this.commandBus.execute(new AuthUserCommand(data));
    console.log('[LOGIN RESPONSE]: ', res.value.getValue());

    if (res.isFailure) {
      response.data = res.errorValue();
      response.statusCode = 400;
    }
    response.statusCode = 200
    response.data = {
      token: await res.value.getValue().authToken,
    }


    return response;
  }

  @MessagePattern('user.create')
  async signup(@Payload() data: any) {
    let response = {
      requestId: data.payload.requestID,
      statusCode: 400,
      data: null
    }
    const userData = data.payload;

    const res = await this.commandBus.execute(new CreateUserCommand(userData));
    if (!res.isFailure) {
      response.data = {
        email: res.value.getValue().email,
        id: res.value.getValue().id,
      }
      response.statusCode = 200
    }
    return {
      requestId: data.payload.requestID,
      statusCode: response.statusCode,
      data: response.data,
    };
  }

  @MessagePattern('user.verify')
  async verify(@Payload() data: any) {
    const result: Result<any> = await this.commandBus.execute(new AuthVerifyCommand(data));

    return result.isSuccess ? result.getValue().isValid : result.error;
  }

}
