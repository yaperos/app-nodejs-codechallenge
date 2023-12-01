import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CreateTransactionService } from '../../application/create-transaction.service';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionModel } from '../../domain/models/transaction.model';

@Controller()
export class CreateTransactionController {
  private readonly logger = new Logger(CreateTransactionController.name);

  constructor(
    private readonly createTransactionService: CreateTransactionService,
  ) {}

  @Post('transaction')
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionModel> {
    this.logger.log(`[create] ${JSON.stringify(createTransactionDto)}`);

    try {
      const response =
        await this.createTransactionService.execute(createTransactionDto);

      return response;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
