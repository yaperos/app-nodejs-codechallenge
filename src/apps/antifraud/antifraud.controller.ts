import { Controller, Get } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @Get()
  getHello(): string {
    return this.antifraudService.getHello();
  }
}
