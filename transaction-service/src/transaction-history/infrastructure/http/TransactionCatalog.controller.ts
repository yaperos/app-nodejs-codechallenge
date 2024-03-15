import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionCatalogCreate } from './types/TransactionCatalog.types';
import { ITransactionCatalogService } from '../../application/services/ITransactionCatalogService';
import { TransactionCatalogModel } from '../../domain/model/TransactionCatalog.model';
import { CatalogTypes } from '../../domain/enums/CatalogTypes';

@ApiTags('API to manage transaction catalog')
@Controller('transaction-catalog')
export class TransactionCatalogController {
  constructor(private readonly service: ITransactionCatalogService) {}

  @ApiResponse({
    status: '2XX',
  })
  @ApiResponse({
    status: '5XX',
  })
  @ApiOperation({
    summary: 'Register new Transaction Type',
    description:
      'Verify that the transaction type exists and created if it not exists',
  })
  @Post('/status')
  async createTransactionStatus(
    @Body() transactionStatus: TransactionCatalogCreate,
  ): Promise<any> {
    return this.service.createTransactionCatalog(
      transactionStatus,
      CatalogTypes.TRANSACTION_STATUS,
    );
  }

  @ApiResponse({
    status: '2XX',
  })
  @ApiResponse({
    status: '5XX',
  })
  @ApiOperation({
    summary: 'Register new Transaction Type',
    description:
      'Verify that the transaction type exists and created if it not exists',
  })
  @Post('/type')
  async createTransactionType(
    @Body() transactionType: TransactionCatalogCreate,
  ): Promise<any> {
    return this.service.createTransactionCatalog(
      transactionType,
      CatalogTypes.TRANSACTION_TYPE,
    );
  }

  @ApiQuery({
    type: 'string',
    name: 'type',
  })
  @ApiResponse({
    status: '2XX',
  })
  @ApiResponse({
    status: '5XX',
  })
  @ApiOperation({
    summary: 'Get All Transaction Catalog by type',
    description: 'Get All Transaction Catalog by type',
  })
  @Get()
  async getAllTransactionCatalogByType(
    @Query('type') type: CatalogTypes,
  ): Promise<TransactionCatalogModel[]> {
    return this.service.getAllTransactionCatalogByType(type);
  }
}
