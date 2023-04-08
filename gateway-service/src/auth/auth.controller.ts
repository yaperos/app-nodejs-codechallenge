import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('user.create');
    await this.client.connect();
  }

  @Post('register')
  async registerUser(@Body() data: createUserDto) {
    console.log(data);
    return this.authService.createUser(data);
  }

  @MessagePattern('user.create')
  async handleUserCreated(data: any) {
    console.log('User created event received', data);
    return data;
  }
}
