import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateTransactionPort } from "../infraestructure/ports/in/create-transaction.port";
import { TypeOrmRespositoryAdapter } from "../infraestructure/adapters/out/typeorm-repository.adapter";
import { EntityRepositoryPort } from "../infraestructure/ports/out/entity-repository.port";
import { Transaction } from "../domain/transaction.domain";
import { TransactionEntityMapper } from "./mappers/transaction-entity.mapper";
import { TransactionEntity } from "../infraestructure/adapters/out/entities/transaction.entity";
import { BusinessException } from "./exceptions/business.exception";
import { ExceptionEnum } from "./enums/exception.enum";
import { UuidUtil } from "./utils/uuid.util";
import { StatusEnum } from "./enums/status.enum";
//import { promisify } from 'util';

@Injectable()
export class CreateTransactionUseCase implements CreateTransactionPort {
    properties: any;
    constructor(@Inject(TypeOrmRespositoryAdapter) private readonly entityRepositoryPort: EntityRepositoryPort) {
        this.properties = require("./utils/message.util");
    }

    async createTransaction(transaction: Transaction): Promise<Transaction> {
        /*const delay = promisify(setTimeout);
        await delay(2000);*/
        let transacctionEntity: TransactionEntity;
        try {
            transacctionEntity = TransactionEntityMapper.toEntity(transaction);
            transacctionEntity.transactionExternalId = UuidUtil.generateUuid();
            transacctionEntity.status = StatusEnum.PENDING;
            transacctionEntity.createdAt = new Date();
            transacctionEntity = await this.entityRepositoryPort.save(transacctionEntity, TransactionEntity);
            return TransactionEntityMapper.toDomain(transacctionEntity);
        } catch (ex) {
            throw new BusinessException(
                ExceptionEnum.ERROR_CREATE_TRANSACTION,
                this.properties.get('exception.transaction.create.error'),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}