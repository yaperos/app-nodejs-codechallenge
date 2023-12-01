import {
  Controller,
  Post,
  Get,
  Body,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
  Param,
} from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

import { FinancialTransactionsService } from '@/transactions/financial-transactions.service';
import { CreateFinancialTransactionDTO } from '@/transactions/dto/create-financial-transaction.dto';
import { ReadFinancialTransactionDTO } from '@/transactions/dto/read-financial-transaction.dto';
import { FinancialTransactionDTOBuilder } from '@/transactions/builders/financial-transaction.dto.builder';
import { FinancialTransactionBuilder } from '@/transactions/builders/financial-transaction.builder';
import { KafkaConfig } from '@/config/kafka.config';
import {
  FinancialTransactionCreatedPayload,
  FinancialTransactionStatusUpdatedPayload,
  KafkaTopics,
} from '@/utils/kafka-events.consts';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

@ApiTags('Financial Transactions')
@ApiExtraModels(ReadFinancialTransactionDTO)
@Controller('financial-transactions')
export class FinancialTransactionsController
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private service: FinancialTransactionsService,
    @Inject(KafkaConfig.ModuleName) private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    [KafkaTopics.FinancialTransactionCreated].forEach((key) =>
      this.kafka.subscribeToResponseOf(key),
    );

    await this.kafka.connect();
  }

  onModuleDestroy() {
    this.kafka.close();
  }

  @Post()
  async create(@Body() dto: CreateFinancialTransactionDTO): Promise<number> {
    const entity = FinancialTransactionBuilder.fromCreateDTO(dto);
    const payload: FinancialTransactionCreatedPayload =
      await this.service.create(entity);

    await this.kafka.emit(KafkaTopics.FinancialTransactionCreated, payload);

    return payload.transactionId;
  }

  @Get()
  async findAll(): Promise<ReadFinancialTransactionDTO[]> {
    const entities = await this.service.findAll();
    return FinancialTransactionDTOBuilder.fromEntities(entities);
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<ReadFinancialTransactionDTO> {
    const entity = await this.service.getOne(id);

    return FinancialTransactionDTOBuilder.fromEntity(entity);
  }

  @EventPattern(KafkaTopics.FinancialTransactionCreated)
  async logCreated(@Payload() dto: Record<string, unknown>) {
    console.log(KafkaTopics.FinancialTransactionCreated);
    console.dir(dto);
  }

  @EventPattern(KafkaTopics.FinancialTransactionStatusUpdated)
  async statusUpdated(
    @Payload() dto: FinancialTransactionStatusUpdatedPayload,
  ) {
    console.log(KafkaTopics.FinancialTransactionStatusUpdated);
    console.log(dto);
    await this.service.updateSatus(dto);
  }
}
