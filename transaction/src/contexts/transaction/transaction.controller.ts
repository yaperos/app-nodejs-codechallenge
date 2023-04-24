import { Body, Controller, Get, HttpCode, Param, Post, Res } from '@nestjs/common';
import { CreateTransactionValidatorPipe } from './pipe/validation.pipe';
import { TransactionScheme } from './schemas/transaction.scheme';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';
import { LoggerService } from '@/config/logger/logger.service';
import { TracerService } from '@/config/tracer/tracer.service';
import { HeadersDto } from './dto/headers.dto';
import {RequestHeader} from "@/config/decorator/request.header";

@Controller('transaction')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private logger: LoggerService,
    private tracer: TracerService,
  ) {}

  @Post()
  @HttpCode(201)
  create(
    @RequestHeader(HeadersDto) headers: HeadersDto,
    @Body(new CreateTransactionValidatorPipe(TransactionScheme)) body: TransactionDto,
  ) {
    this.logger.log(
      {
        layer: 'TransactionController',
        function: 'create',
        eventId: this.tracer.getTrace(),
        entityId: body.accountExternalIdCredit,
        request: { headers, body },
      },
      'received request to publish a new transaction',
    );
    return this.transactionService.create(body, headers);
  }

  @Get(':id')
  find(
    @RequestHeader(HeadersDto) headers: HeadersDto,
    @Param('id') id: string,
    @Res() res,
  ) {
    this.logger.log(
      {
        layer: 'TransactionController',
        function: 'find',
        eventId: this.tracer.getTrace(),
        request: {headers, param: id}
      },
      'received request to find a transaction',
    );
    return this.transactionService.find(id, res);
  }
}
