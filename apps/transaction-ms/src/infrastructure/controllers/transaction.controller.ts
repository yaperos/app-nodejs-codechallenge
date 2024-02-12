import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Res,
} from '@nestjs/common';
import { TransactionService } from '../../domain/services/transaction.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, STATES } from 'mongoose';
import { Response } from 'express';
import { Token } from '../constants';

@Controller('trans')
export class TransactionController {
  constructor(
    @Inject(Token.TRANSACTION)
    private readonly transactionService: TransactionService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(@Res() res: Response): unknown {
    if (this.connection.readyState !== STATES.connected) {
      // this.logger.warn(`Ready state = ${STATES[this.connection.readyState]}`);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ db: { status: 'down' } });
    }
    res.json({ db: { status: 'up' } });
    // return 'This action returns all cats';
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string): Promise<unknown> {
    const transaction = await this.transactionService.getById(id);

    return { data: transaction } as unknown;
  }
}
