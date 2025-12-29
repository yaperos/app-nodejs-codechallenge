import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionResponseDto } from './dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new transaction',
    description:
      'Creates a transaction with pending status. The anti-fraud service will validate it asynchronously via Kafka. Transactions with value > 1000 will be rejected.',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Transaction type not found' })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get transaction by ID',
    description:
      'Retrieves a transaction by its external ID. The status may be pending, approved, or rejected depending on anti-fraud validation.',
  })
  @ApiParam({
    name: 'id',
    description: 'Transaction external ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.findOne(id);
  }
}
