import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '../../application/create-transaction/create-transaction.command';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiResponse } from '@nestjs/swagger';
import { ResponseDescription } from './response-description';
import { CreateTransactionBodyDTO } from '../dto/create-transaction.dto';
@Controller('/api/v1/create-transaction')
export class CreateTransactionController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiResponse({ status: 201, description: ResponseDescription.CREATED })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async openAccount(@Body() payload: CreateTransactionBodyDTO): Promise<any> {
    console.log('-----------------------------');
    console.log('CreateTransactionController/createTransaction');
    const command: CreateTransactionCommand = new CreateTransactionCommand(
      payload.accountExternalIdCredit,
      payload.accountExternalIdDebit,
      payload.tranferTypeId,
      payload.value,
    );

    return this.commandBus.execute(command);
  }
}
