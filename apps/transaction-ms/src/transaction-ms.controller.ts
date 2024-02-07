import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { TransactionMsService } from './transaction-ms.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, STATES } from 'mongoose';
import { Response } from 'express';

@Controller()
export class TransactionMsController {
  constructor(
    private readonly transactionMsService: TransactionMsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(@Res() res: Response): any {
    if (this.connection.readyState !== STATES.connected) {
      // this.logger.warn(`Ready state = ${STATES[this.connection.readyState]}`);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ db: { status: 'down' } });
    }
    res.json({ db: { status: 'up' } });
    // return this.transactionMsService.getHello();
  }
}
