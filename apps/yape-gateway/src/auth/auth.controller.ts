import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  createUser(@Body() login: any) {
    console.log('gw login');
    return this.authService.login(login);
  }
}
