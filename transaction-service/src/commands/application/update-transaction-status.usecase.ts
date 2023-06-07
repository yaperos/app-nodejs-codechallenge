import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Transaction } from "../domain/transaction.domain";
import { UpdateTransactionStatusPort } from "../infraestructure/ports/in/update-transaction-status.port";
import { TypeOrmRespositoryAdapter } from "../infraestructure/adapters/out/typeorm-repository.adapter";
import { EntityRepositoryPort } from "../infraestructure/ports/out/entity-repository.port";
import { BusinessException } from "./exceptions/business.exception";
import { ExceptionEnum } from "./enums/exception.enum";
import { TransactionEntity } from "../infraestructure/adapters/out/entities/transaction.entity";
import { TransactionEntityMapper } from "./mappers/transaction-entity.mapper";

@Injectable()
export class UpdateTransactionStatusUseCase implements UpdateTransactionStatusPort {
    properties: any;
    constructor(@Inject(TypeOrmRespositoryAdapter) private readonly entityRepositoryPort: EntityRepositoryPort) {
        this.properties = require("./utils/message.util");
    }

    async updateTransactionStatus(transaction: Transaction): Promise<Transaction> {
        try {
            let entity = await this.entityRepositoryPort.getByFields({"transactionExternalId": transaction.transactionExternalId}, TransactionEntity);
            entity.status = transaction.status;
            entity = await this.entityRepositoryPort.update(entity, TransactionEntity);
            return TransactionEntityMapper.toDomain(entity);
        } catch(ex) {
            throw new BusinessException(
                ExceptionEnum.ERROR_UPDATE_TRANSACTION_STATUS,
                this.properties.get('exception.transaction.update_status.error'),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}