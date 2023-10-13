import { Body, Controller, Post } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';

@Controller('antifraud')
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @Post()
  async validateCreatedTransaction(@Body() antifraudDto: any): Promise<any> {
    console.log(antifraudDto);
    return antifraudDto;
  }
}
