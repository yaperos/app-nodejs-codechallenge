import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto';

@Controller('balances')
export class BalanceController {
  constructor(
    private balanceService: BalanceService,
  ) {}

  @Get()
  getBalances() {
    return this.balanceService.getAll();
  }
  @Get(':id')
  getBalanceById(@Param('id') balanceId: string) {
    return this.balanceService.getBalanceById(
      balanceId,
    );
  }

  @Post()
  createBalance(@Body() dto: CreateBalanceDto) {
    return this.balanceService.createBalance(dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBalanceById(
    @Param('id', ParseIntPipe) balanceId: string,
  ) {
    return this.balanceService.deleteBalanceById(
      balanceId,
    );
  }
}
