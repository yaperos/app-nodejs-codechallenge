import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { GenericResponseDto } from 'src/accounts/domain/dto/generic-response.dto';
import { UpdateAccount } from 'src/accounts/domain/use-case/update-account';
import { UpdateAccountRequestDto } from '../dto/update-account-request.dto';

@Controller('api/v1/accounts')
export class UpdateAccountController {
  public constructor(
    @Inject('UPDATE_ACCOUNT') private readonly updateAccount: UpdateAccount,
  ) {}

  @Patch(':userId')
  public async execute(
    @Param('userId') userId: string,
    @Body() dto: UpdateAccountRequestDto,
  ): Promise<GenericResponseDto> {
    return await this.updateAccount.execute(userId, dto);
  }
}
