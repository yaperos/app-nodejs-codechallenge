import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { AccountsService } from './accounts.service';
import { AccountDto } from './dtos/account.dto';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOkResponse({ type: [AccountDto] })
  async findAll(@Query() query: FilterQuery<AccountDto>) {
    return this.accountsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: AccountDto })
  @ApiNotFoundResponse()
  async findById(@Param('id') id: string) {
    return this.accountsService.findById(id);
  }

  @Post()
  @ApiOkResponse({ type: AccountDto })
  @ApiBadRequestResponse()
  async create(@Body() createDto: CreateAccountDto) {
    return this.accountsService.create(createDto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: AccountDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async update(@Param('id') id: string, @Body() updateDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async delete(@Param('id') id: string) {
    return this.accountsService.delete(id);
  }
}
