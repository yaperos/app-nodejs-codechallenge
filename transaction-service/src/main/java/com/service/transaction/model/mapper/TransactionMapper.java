package com.service.transaction.model.mapper;

import com.service.transaction.model.entity.Transaction;
import com.service.transaction.model.request.TransactionCreateRequest;
import com.service.transaction.model.response.TransactionCreateResponse;
import com.service.transaction.model.response.TransactionListResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * <b>Class</b>: TransactionMapper<br/>
 * Copyright: &copy; 2026.<br/>
 * Company: Yape.<br/>
 *
 * <u>Developed by</u>: <br/>
 * <ul>
 *     <li>Felipe Rosado</li>
 *     <li>February 21, 2026 Creaci&oacute;n de Clase.</li>
 * </ul>
 * @version 1.0
 */
@Mapper(componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface TransactionMapper {

  @Mapping(target = "accountExternalIdDebit", source = "accountExternalIdDebit")
  @Mapping(target = "accountExternalIdCredit", source = "accountExternalIdCredit")
  @Mapping(target = "transferTypeId", source = "transferTypeId")
  @Mapping(target = "value", source = "value")
  Transaction mapToEntity(TransactionCreateRequest request);

  @Mapping(target = "transactionId", source = "id")
  @Mapping(target = "transactionExternalId", source = "transactionExternalId")
  @Mapping(target = "transactionAmount", source = "value")
  TransactionCreateResponse mapToCreateResponse(Transaction transaction);


  default TransactionListResponse mapDetailResponse(Transaction transaction) {
    return TransactionListResponse.builder()
        .transactionExternalId(transaction.getTransactionExternalId())
        .transactionType(TransactionListResponse.TransactionTypeDto.builder()
            .name(mapToTypeTransfer(transaction.getTransferTypeId()))
            .build())
        .transactionStatus(TransactionListResponse.TransactionStatusDto.builder()
            .name(transaction.getStatus().getValue())
            .build())
        .value(transaction.getValue())
        .createdAt(transaction.getCreatedAt())
        .build();
  }

  default String mapToTypeTransfer(int transferTypeId) {
    if (transferTypeId == 1) {
      return "Debit";
    }
    return "Yape Transfer";
  }

}