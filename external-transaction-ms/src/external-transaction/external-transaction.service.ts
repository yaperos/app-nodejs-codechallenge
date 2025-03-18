import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { MasterTableService } from 'src/master-table/master-table.service';
import { MasterTableConstant } from 'src/constants';
import { FindOneTransactionDto } from './dto/find-one-trasaction.dto';
import { ANTI_FRAUD_SERVICE } from 'src/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ExternalTransactionService
  extends PrismaClient
  implements OnModuleInit
{
  private readonly logger = new Logger('ExternalTransactionService');

  constructor(
    private readonly masterTableService: MasterTableService,
    @Inject(ANTI_FRAUD_SERVICE) private readonly kafkaClient: ClientKafka,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database Connected');
  }

  async create(createTransactionDto: CreateTransactionDto) {
    const {
      accountExternalIdCredit,
      accountExternalIdDebit,
      tranferTypeId,
      value,
    } = createTransactionDto;

    const creditAccount = await this.externalCreditAccount.findUnique({
      where: { id: accountExternalIdCredit },
    });

    if (!creditAccount) throw new Error(`External Credit Account not found`);

    const debitAccount = await this.externalDebitAccount.findUnique({
      where: { id: accountExternalIdDebit },
    });

    if (!debitAccount) throw new Error(`External Debit Account not found`);

    const status = await this.masterTableService.findFirst({
      parentId: MasterTableConstant.TransactionStatus,
    });

    const type = await this.masterTableService.findFirst({
      parentId: MasterTableConstant.TransactionType,
    });

    const record = await this.externalTransaction.create({
      data: {
        externalCreditAccountId: accountExternalIdCredit,
        externalDebitAccountId: accountExternalIdDebit,
        value: value,
        statusId: status.id,
        typeId: type.id,
        transferTypeId: tranferTypeId,
      },
      include: {
        externalCreditAccount: true,
        externalDebitAccount: true,
        status: true,
        transferType: true,
        type: true,
      },
    });

    this.kafkaClient.emit(
      'verify.transaction',
      JSON.stringify({ ...record, status: status.name }),
    );

    return JSON.stringify(record);
  }

  async findAll() {
    const records = await this.externalTransaction.findMany({
      include: {
        externalCreditAccount: true,
        externalDebitAccount: true,
        status: true,
        transferType: true,
        type: true,
      },
    });

    return JSON.stringify(records);
  }

  async findOne(findOneTransactionDto: FindOneTransactionDto) {
    const {
      transactionExternalId,
      transactionStatus,
      transactionType,
      value,
      createdAt,
    } = findOneTransactionDto;

    const status = await this.masterTableService.findOne({
      id: transactionStatus.id,
      name: transactionStatus.name,
      parentId: MasterTableConstant.TransactionStatus,
    });

    const type = await this.masterTableService.findOne({
      id: transactionType.id,
      name: transactionType.name,
      parentId: MasterTableConstant.TransactionType,
    });

    const startOfDay = new Date(createdAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(createdAt);
    endOfDay.setHours(23, 59, 59, 999);

    const record = await this.externalTransaction.findFirst({
      where: {
        id: transactionExternalId,
        statusId: status?.id,
        typeId: type?.id,
        value: value,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        externalCreditAccount: true,
        externalDebitAccount: true,
        status: true,
        transferType: true,
        type: true,
      },
    });

    this.logger.log({ record });

    if (!record) throw new Error(`Transaction record not found`);

    return JSON.stringify(record);
  }

  async update(updateTransactionDto: UpdateTransactionDto) {
    const status = await this.masterTableService.findOne({
      parentId: MasterTableConstant.TransactionStatus,
      name: updateTransactionDto.status,
    });

    const record = await this.externalTransaction.update({
      data: {
        statusId: status?.id,
        updatedAt: new Date(),
      },
      where: {
        id: updateTransactionDto.id,
      },
    });

    return record;
  }

  remove(id: string) {
    return `This action removes a #${id} transaction`;
  }

  async findAllExternalCreditAccount() {
    const records = await this.externalCreditAccount.findMany();

    return JSON.stringify(records);
  }

  async findAllExternalDebitAccount() {
    const records = await this.externalDebitAccount.findMany();

    return JSON.stringify(records);
  }
}
