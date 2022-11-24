import { Mapper } from "ts-mapstruct";
import { NewTransactionRqDto } from "../dto/new-transaction-rq.dto/new-transaction-rq.dto";
import { TransactionEntity } from "../entity/transaction.entity";
import {
  TransactionRsDto,
  TransactionStatusResponse,
  TransactionTypeResponse
} from "../dto/transaction-rs.dto/transaction-rs.dto";
import { TransactionStatusEnum } from "../dto/TransactionStatus.enum";
import { TransactionTypeEntity } from "../entity/transaction-type.entity";
import { TransactionReadEntity } from "../entity/transaction-read.entity";

@Mapper()
export class TransactionMapper {

  mapEntityToResponse(transactionEntity: TransactionEntity): TransactionRsDto {
    let transactionRsDto = new TransactionRsDto;
    transactionRsDto.transactionExternalId = transactionEntity.transactionExternalId;
    transactionRsDto.value = transactionEntity.value;
    transactionRsDto.createdAt = transactionEntity.createDateTime;
    transactionRsDto.transactionType = this.mapInTransactionType(transactionEntity.transactionType);
    transactionRsDto.transactionStatus = this.mapInStatus(transactionEntity.transactionStatus);
    return transactionRsDto;
  }

   mapInTransactionType(transactionTypeEntity: TransactionTypeEntity) {
    let transactionTypeResponse = new TransactionTypeResponse();
     transactionTypeResponse.name = transactionTypeEntity.name
    return transactionTypeResponse;
  }

  mapRequestToEntity(transactionDTO: NewTransactionRqDto): TransactionEntity {
    let transaction = new TransactionEntity();
    transaction.accountExternalIdDebit = transactionDTO.accountExternalIdDebit;
    transaction.accountExternalIdCredit = transactionDTO.accountExternalIdCredit;
    transaction.value = transactionDTO.value;
    transaction.transactionType = this.mapTypeToEntity(transactionDTO.tranferTypeId);
    transaction.transactionStatus = TransactionStatusEnum.PENDING;
    transaction.createDateTime = new Date();
    transaction.createdBy = "ADMIN";
    transaction.lastChangedBy = "ADMIN";
    return transaction;
  }
  mapTypeToEntity(id: number){
    let typeTransaction= new TransactionTypeEntity();
    typeTransaction.id = id;
    return typeTransaction;
  }

  mapTypeToResponse(name: string){
    let typeTransaction= new TransactionTypeResponse();
    typeTransaction.name = name;
    return typeTransaction;
  }

  private mapInStatus(transactionStatus: string) {
    let status = new TransactionStatusResponse();
    status.name = transactionStatus;
    return status;
  }

  public mapTransactionResponseToRead(transaction: TransactionRsDto){
    let transactionRead = new TransactionReadEntity();
    transactionRead.transactionExternalId = transaction.transactionExternalId;
    transactionRead.transactionStatus = transaction.transactionStatus.name;
    transactionRead.transactionTypeName = transaction.transactionType.name;
    transactionRead.value = transaction.value;
    transactionRead.createAt = transaction.createdAt;
    return transactionRead;
  }

  public mapTransactionReadToResponse(transaction: TransactionReadEntity){
    let response = new TransactionRsDto();
    response.transactionExternalId = transaction.transactionExternalId;
    response.createdAt = transaction.createAt;
    response.value = transaction.value;
    response.transactionType = this.mapTypeToResponse(transaction.transactionTypeName);
    response.transactionStatus = this.mapInStatus(transaction.transactionStatus);
    return response;
  }
}
