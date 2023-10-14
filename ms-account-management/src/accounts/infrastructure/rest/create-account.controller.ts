import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateAccount } from 'src/accounts/domain/use-case/create-account';
import { CreateAccountRequestDto } from '../dto/create-account-request.dto';
import { GenericResponseDto } from 'src/accounts/domain/dto/generic-response.dto';

@Controller('api/v1/accounts')
export class CreateAccountController {
  public constructor(
    @Inject('CREATE_ACCOUNT') private readonly createAccount: CreateAccount,
  ) {}

  @Post()
  public async execute(
    @Body() dto: CreateAccountRequestDto,
  ): Promise<GenericResponseDto> {
    return await this.createAccount.execute(dto);
  }
}
