import { Controller, Get } from '@nestjs/common';
import { MsAntifraudService } from './ms-antifraud.service';

@Controller()
export class MsAntifraudController {
  constructor(private readonly msAntifraudService: MsAntifraudService) {}

  @Get()
  getHello(): string {
    return this.msAntifraudService.getHello();
  }
}
