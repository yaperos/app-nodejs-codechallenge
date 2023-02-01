import { Controller, Get } from '@nestjs/common';
import { YapeAuthService } from './yape-auth.service';

@Controller()
export class YapeAuthController {
  constructor(private readonly yapeAuthService: YapeAuthService) {}

  @Get()
  getHello(): string {
    return this.yapeAuthService.getHello();
  }
}
