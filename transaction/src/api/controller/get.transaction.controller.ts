import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiResponse } from '@nestjs/swagger';
import { FindTransactionByIdQuery } from '../../application/get-transaction/find-transaction-by-id.query';
import { FindTransactionByIdParamDTO } from '../dto/find-transaction-by-id.param.dto';
import { ResponseDescription } from './response-description';

@Controller('/api/v1/get-transaction')
export class GetTransactionController {
  constructor(private queryBus: QueryBus) {}

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: ResponseDescription.OK,
    type: FindTransactionByIdParamDTO,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findTransactionById(@Param() param: FindTransactionByIdParamDTO): Promise<any> {
    const query = new FindTransactionByIdQuery(param.id);
    return this.queryBus.execute(query);
  }
}
