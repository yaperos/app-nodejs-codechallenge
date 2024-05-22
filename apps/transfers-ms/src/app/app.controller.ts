import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { TransferDto } from './dto/transfer.dto';
import { TransferCommand } from './interfaces/transfer.command';

@Controller('transfers')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getTransaction(@Param('id') id: string) {
    return this.appService.getTransaction(id);
  }
  @Post()
  saveTransfer(@Body() transfer: TransferDto) {
    const command = new TransferCommand(transfer);
    return this.appService.saveTransfer(command);
  }
}
