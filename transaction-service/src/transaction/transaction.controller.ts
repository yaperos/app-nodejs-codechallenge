import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionsService: TransactionService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'La transacción fue creada exitosamente.',
    type: TransactionDto,
  })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Transacción obtenida correctamente.',
    type: TransactionDto,
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TransactionDto> {
    return this.transactionsService.findOne(id);
  }

  @EventPattern('transaction_updated')
  updateStatus(@Payload() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.updateStatus(updateTransactionDto);
  }
}
