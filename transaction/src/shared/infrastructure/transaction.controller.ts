import {
  AntiFraudTransactionStatusEventDto,
  TransactionCreateInputDto,
} from 'src/create/infra/transaction.create.dto';
import {
  TransactionFindInputDto,
  TransactionQuery,
} from 'src/find/infra/transaction.find.dto';
import { ApiTags } from '@nestjs/swagger';
import { TransactionToQueryResult } from './transaction.mapper';
import { Body, Controller, Get, Post, Param, Logger } from '@nestjs/common';
import { MessageTopic } from './broker/kafka/decorators/kafka.decorator';
import { TransactionFindService } from 'src/find/infra/transaction.find.service';
import { TransactionCreateService } from 'src/create/infra/transaction.create.service';
import { TransactionAntiFraudeService } from 'src/update-status/infra/transaction.create.service';

@ApiTags('')
@Controller('')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(
    private readonly findService: TransactionFindService,
    private readonly createService: TransactionCreateService,
    private readonly hadleAntiFraudeService: TransactionAntiFraudeService,
  ) {}

  @Post()
  public create(@Body() input: TransactionCreateInputDto) {
    return this.createService.handle(input);
  }
  @Get(':id')
  public getById(
    @Param() { id }: TransactionFindInputDto,
  ): Promise<TransactionQuery | null> {
    return this.findService
      .byId(id)
      .then((r) => (r ? TransactionToQueryResult.handle(r) : null));
  }

  @MessageTopic('anti-fraud_transaction-status')
  handle(input: AntiFraudTransactionStatusEventDto) {
    this.logger.log(
      `[anti-fraud_transaction-status] payload: ${JSON.stringify(input)}`,
    );
    return this.hadleAntiFraudeService.handle(input);
  }
}
