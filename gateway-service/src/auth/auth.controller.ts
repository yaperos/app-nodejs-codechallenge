import {
  Body,
  Controller,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto';
import { ClientKafka } from '@nestjs/microservices';

@Controller('auth')
export class AuthController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('user.create');
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Post('register')
  async registerUser(@Body() data: createUserDto): Promise<any> {
    console.log('Sending user.create event', data);
    const res = await this.authService.createUser(data);
    console.log('User created event received', res);
    const a = await this.client.send('user.create', res);
    return a;
  }
}
