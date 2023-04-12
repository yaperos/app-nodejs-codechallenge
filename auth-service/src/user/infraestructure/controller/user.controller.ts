import {Controller, Post} from "@nestjs/common";
import {UserUseCases} from "../../application/user.usecases";
import {MessagePattern, Payload} from "@nestjs/microservices";
import {CreateUserDTO} from "../dto/user.register.dto";

@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserUseCases,
  ) {
  }

  @MessagePattern('user.create')
  async signup(@Payload() data: CreateUserDTO) {
    const userData = data.payload;
    const user = await this.userService.createUser(userData);
    return {ok: true, data: user};
  }
}