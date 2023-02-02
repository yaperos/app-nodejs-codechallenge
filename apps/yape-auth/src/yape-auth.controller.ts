import { Controller, Get } from '@nestjs/common';
import { YapeAuthService } from './yape-auth.service';
import {EventPattern, Payload} from "@nestjs/microservices";
import {LoginDto} from "@yape/yape-domain/dto/auth.dto";

@Controller()
export class YapeAuthController {
  constructor(private readonly authService: YapeAuthService) {}

  @EventPattern({cmd: 'auth.login'})
  handleLogin(@Payload() data: LoginDto) {
    console.log('login event received');
    return this.authService.login(data.username, data.password);
  }

  @EventPattern({cmd: 'auth.validate'})
  handleValidate(@Payload() token: string) {
    console.log('validate token event received');
    return this.authService.validate(token);
  }
}
