import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Devuelve un mensaje de bienvenida.',
    schema: {
      example: 'Test Yapero Transaction'
    }
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
