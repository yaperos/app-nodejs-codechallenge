import { Inject, Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { NewTransactionRqDto } from "../dto/new-transaction-rq.dto/new-transaction-rq.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionRepository } from "../repository/transaction.repository";
import { TransactionRsDto } from "../dto/transaction-rs.dto/transaction-rs.dto";
import { TransactionTypeService } from "./transaction-type/transaction-type.service";
import { TransactionMapper } from "../mapper/transaction.mapper";
import { TransactionEntity } from "../entity/transaction.entity";
import { TransactionStatusEnum } from "../dto/TransactionStatus.enum";
import { ClientKafka } from "@nestjs/microservices";
import { AntiFraudResponseDto } from "../dto/anti-fraud-response.dto";
import { response } from "express";
import { lastValueFrom, map } from "rxjs";
import { CommandBus } from "@nestjs/cqrs";
import { CreateTransactionComand } from "../commands/create-transaction.comand";
import { UpdateTransactionComand } from "../commands/update-transaction.comand";


@Injectable()
export class TransactionService implements OnModuleInit{

  private readonly logger = new Logger(TransactionService.name);

  private static readonly ANTI_FRAUD_TOPIC = "valid-anti-fraud-send";

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly _transactionRepository: TransactionRepository,
    @Inject(TransactionTypeService)
    private readonly _transactionTypeService: TransactionTypeService,
    @Inject(TransactionMapper)
    private readonly _transactionMapper: TransactionMapper,
    @Inject("antifraud-client")
    private readonly clientKafka: ClientKafka,
    private readonly commandBus: CommandBus
  ) {
  }

  onModuleInit() {
    this.clientKafka.subscribeToResponseOf(TransactionService.ANTI_FRAUD_TOPIC);
  }

  public async generateNewTransaction(transaction: NewTransactionRqDto): Promise<TransactionRsDto> {
    this.logger.log("TransactionService.generateNewTransaction :::: Send transaction status PENDING ");
    const transactionRq: NewTransactionRqDto = transaction;
    if (transactionRq.accountExternalIdCredit == null &&
      transactionRq.accountExternalIdDebit == null) {
      throw new NotFoundException("account credit or debit is empty");
    }
    const transactionTypeEntity = await this._transactionTypeService.findById(transactionRq.tranferTypeId);
    if (transactionTypeEntity == null)
      throw new NotFoundException("account type not found");
    let transactionEntity = this._transactionMapper.mapRequestToEntity(transactionRq);
    transactionEntity.transactionStatus = TransactionStatusEnum.PENDING;
    let transactionResult = await this._transactionRepository.save(transactionEntity);
    this.logger.log("TransactionService.generateNewTransaction :::: SAVE IN WRITE DATABASE ");
    return await this.findById(transactionResult.transactionExternalId);
  }

  public async sendValidAntiFraud(transactionResult: TransactionRsDto) {
    this.logger.log("TransactionService.sendValidAntiFraud :::: SENDING TRANSACTION TO ANTI-FRAUD SERVICE ");
    let antiFraudDTO = {
      transactionExternalId: transactionResult.transactionExternalId,
      value: transactionResult.value
    };
    let antiFraudResponse : AntiFraudResponseDto = await lastValueFrom(
      this.clientKafka.send(TransactionService.ANTI_FRAUD_TOPIC, JSON.stringify(antiFraudDTO)))
        .catch( x =>
          console.log(x)
    );
    console.log(antiFraudResponse);
    await this.commandBus.execute(new UpdateTransactionComand(antiFraudResponse));
    transactionResult.transactionStatus.name = antiFraudResponse.status;
    return transactionResult;
  }

  public async updateStatusTransaction(response: AntiFraudResponseDto) {
    this.logger.log("TransactionService.updateStatusTransaction :::: UPDATE STATUS IN WRITE DATABASE ");

    return await this._transactionRepository.createQueryBuilder()
      .update()
      .set({
        transactionStatus: response.status
      }).where("transactionExternalId =:id", { id: response.transactionExternalId })
      .execute();
  }

  public async findById(idTransaction: string): Promise<TransactionRsDto> {
    this.logger.log("TransactionService.findById :::: FIND TRANSACTION BY transactionExternalId ", idTransaction);
    let transactionEntity = await this._transactionRepository.findOne({
      where: { transactionExternalId: idTransaction }
    });
    return this._transactionMapper.mapEntityToResponse(transactionEntity);
  }

}
