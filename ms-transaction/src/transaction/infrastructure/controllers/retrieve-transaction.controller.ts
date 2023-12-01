import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { RetrieveTransactionService } from '../../application/retrieve-transaction.service';
import { TransactionDescription } from '../../domain/interfaces/transaction-description.interface';

@Controller()
export class RetrieveTransactionController {
  private readonly logger = new Logger(RetrieveTransactionController.name);

  constructor(
    private readonly retrieveTransactionService: RetrieveTransactionService,
  ) {}

  @Get('transaction/:id')
  async get(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TransactionDescription> {
    this.logger.log(`[get] ${id}`);

    try {
      const response = await this.retrieveTransactionService.execute(id);

      return response;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
