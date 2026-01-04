package com.yape.challenge.transaction.application.mapper;

import com.yape.challenge.common.dto.TransactionCreatedEvent;
import com.yape.challenge.transaction.application.dto.request.CreateTransactionRequest;
import com.yape.challenge.transaction.application.dto.response.TransactionResponse;
import com.yape.challenge.transaction.domain.entity.Transaction;
import com.yape.challenge.transaction.domain.entity.TransactionType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "externalId", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "transferTypeId", source = "tranferTypeId")
    Transaction toEntity(CreateTransactionRequest request);

    @Mapping(target = "transactionExternalId", source = "externalId")
    @Mapping(target = "status", source = "transaction.status")
    TransactionCreatedEvent toCreatedEvent(Transaction transaction);

    @Mapping(target = "transactionExternalId", source = "transaction.externalId")
    @Mapping(target = "transactionType", source = "transactionType", qualifiedByName = "mapTransactionType")
    @Mapping(target = "transactionStatus", source = "transaction.status", qualifiedByName = "mapTransactionStatus")
    @Mapping(target = "value", source = "transaction.value")
    @Mapping(target = "createdAt", source = "transaction.createdAt")
    TransactionResponse toResponse(Transaction transaction, TransactionType transactionType);

    @Named("mapTransactionType")
    default TransactionResponse.TransactionTypeDto mapTransactionType(TransactionType transactionType) {
        if (transactionType == null) {
            return null;
        }
        return TransactionResponse.TransactionTypeDto.builder()
                .name(transactionType.getName())
                .build();
    }

    @Named("mapTransactionStatus")
    default TransactionResponse.TransactionStatusDto mapTransactionStatus(com.yape.challenge.common.dto.TransactionStatus status) {
        if (status == null) {
            return null;
        }
        return TransactionResponse.TransactionStatusDto.builder()
                .name(status.name())
                .build();
    }
}

