import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VerificarTransaccionRequestDto } from './data/request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('verify-transaction')
  handleEventVerifyTransaction(@Payload() data: VerificarTransaccionRequestDto) {
    console.log("Requestdata",data)
    return this.appService.verificarTransaccion(data);
  }
}
