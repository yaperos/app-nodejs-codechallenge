import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './account.dto';

@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  @Get()
  async all() {
    this.logger.log('All accounts');
    return await this.accountService.all();
  }

  @Post()
  async create(@Body() data: AccountDto) {
    const account = await this.accountService.create(data);
    this.logger.log('Account created', account.id);
    return account;
  }
}
