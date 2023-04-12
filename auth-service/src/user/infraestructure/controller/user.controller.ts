import {Controller, Inject, Post} from "@nestjs/common";
import {UserUseCases} from "../../application/user.usecases";
import {ClientKafka, MessagePattern, Payload} from "@nestjs/microservices";
import {CreateUserDTO} from "../dto/user.register.dto";

@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserUseCases,
    @Inject('AUTH_SERVICE') private readonly client: ClientKafka,
  ) {
  }

  @MessagePattern('user.create')
  async signup(@Payload() data: any) {
    console.log('USER CREATE: ', data)
    const userData = data.payload;
    const user = await this.userService.createUser(userData);
    if(user.value.isSuccess) {
      this.client.emit('user.create.completed', {
        userID: user.value._value.id,
      })
    }
    const responseData = {
      userID: user.value._value.id,
      userStatus: user.value._value.status,
    }
    console.log({
      requestId: data.requestID,
      statusCode: user.value.isSuccess ? 200 : 400,
      data: user.value.isSuccess ? responseData: 'An error occurred',
    })
    return {
      requestId: data.payload.requestID,
      statusCode: user.value.isSuccess ? 200 : 400,
      data: user.value.isSuccess ? responseData: 'An error occurred',
    }
  }
}