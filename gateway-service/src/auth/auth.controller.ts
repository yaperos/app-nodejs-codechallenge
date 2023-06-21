import {
  Body,
  Controller,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {createUserDto, loginUserDto} from './dto';
import { ClientKafka } from '@nestjs/microservices';

@Controller('auth')
export class AuthController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly authService: AuthService,
    @Inject('GATEWAY_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('user.create');
    this.client.subscribeToResponseOf('user.login');
    this.client.subscribeToResponseOf('user.verify');
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Post('register')
  async registerUser(@Body() data: createUserDto): Promise<any> {
    const payload = await this.authService.createUser(data);
    return this.client.send('user.create', {
      requestId: data.requestId,
      payload,
    });
  }

  @Post('login')
  async loginUser(@Body() data: loginUserDto): Promise<any> {
    const payload = await this.authService.login(data);
    console.log('[LOGIN PAYLOAD]: ', payload)
    return await this.client.send('user.login', payload);
  }

  @Post('verify')
  async verifyUser(@Body() data: any): Promise<any> {
    const payload = await this.authService.verify(data);
    console.log('[VERIFY PAYLOAD]: ', payload)
    return await this.client.send('user.verify', payload);
  }
}
