import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto, RegisterDto, UserDTO } from 'src/dto/create-user.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');


  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern('validate_user')
  async validateUser(data: UserDTO) {
    const user = await this.authService.findByUserId(data);
    
    this.logger.debug(JSON.stringify(user))
    return user
      ? { id: user.userId, username: user.name, email: user.email }
      : null;
  }
}
