import { Transaction } from "src/domain/entity/transaction.entity";
import { TransactionCreateRequest } from "../dto/request/transactionCreateRequest.dto";
import { TransactionStatusEnum } from "../enum/transactionStatus.enum";
import { TransactionTypeEnum } from "../enum/transactionType.enum";
import {v4 as uuidv4} from 'uuid';
import { TransactionDto } from "../dto/transactionDto.dto";
import { TransferTypeEnum } from "../enum/transferType.enum";
import { TransactionResponse } from "../dto/response/transactionResponse.dto";
import { TransactionStatusDto } from "../dto/transactionStatusDto.dto";
import { TransactionTypeDto } from "../dto/transactionTypeDto.dto";

export class TransactionMapper {
   
  private static  getTransferTypeByValue(value: number) : string{
    const index = Object.values(TransferTypeEnum).indexOf(value as unknown as TransferTypeEnum);
     return  Object.keys(TransferTypeEnum)[index];
  }

  static convertToTransaction(transactionRequest: TransactionCreateRequest): Transaction {
    const entity = new Transaction();
    entity.code = uuidv4()
    entity.accountExternalIdCredit = transactionRequest.accountExternalIdCredit;
    entity.accountExternalIdDebit = transactionRequest.accountExternalIdDebit;
    entity.value = transactionRequest.value;
    entity.tranferType = TransactionMapper.getTransferTypeByValue(transactionRequest.tranferTypeId);
    entity.status = TransactionStatusEnum.PENDING;
    entity.type = TransactionTypeEnum.TRANSFER;
  
    return entity;
  }

  static convertToTransactionDto( traceId: string, entity: Transaction): TransactionDto {
    const response = new TransactionDto();
    response.id = entity.id;
    response.code = entity.code;
    response.accountExternalIdCredit = entity.accountExternalIdCredit;
    response.accountExternalIdDebit = entity.accountExternalIdDebit;
    response.status = entity.status;
    response.tranferType = entity.tranferType;
    response.type = entity.type;
    response.value = entity.value;
    response.traceId = traceId
  
    return response;
  }

  static convertToTransactionResponse(entity: Transaction): TransactionResponse {
    const response = new TransactionResponse();
    response.transactionExternalId = entity.code;
    response.transactionStatus = new TransactionStatusDto(entity.status)
    response.transactionType = new TransactionTypeDto(entity.type)
    response.value = entity.value;
    response.createAt = entity.createdAt;
  
    return response;
  }

}

