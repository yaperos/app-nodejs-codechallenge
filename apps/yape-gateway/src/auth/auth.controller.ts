import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {LoginDto} from "@yape/yape-domain/dto/auth.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  createUser(@Body() login: LoginDto) {
    console.log('gw login');
    return this.authService.login(login);
  }
}
