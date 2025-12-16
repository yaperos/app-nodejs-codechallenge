package com.yape.challenge.application.service.mapper;

import com.yape.challenge.adapter.out.persistence.model.TransactionModelRepositoryRequest;
import com.yape.challenge.adapter.out.persistence.model.TransactionModelRepositoryResponse;
import com.yape.challenge.adapter.out.persistence.model.TransactionRepositoryResponse;
import com.yape.challenge.domain.model.CreateTransactionEvent;
import com.yape.challenge.domain.model.Status;
import com.yape.challenge.model.TransactionDetailResponse;
import com.yape.challenge.model.TransactionRequest;
import com.yape.challenge.model.TransactionResponse;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        imports = {Status.class})
public interface TransactionServiceMapper {
    @Mapping(target = "status",
            expression = "java(Status.PENDING.getDescription())")
    TransactionModelRepositoryRequest toMapRepositoryRequest(TransactionRequest request);

    TransactionResponse toMapResponse(TransactionModelRepositoryResponse response);

    @Mapping(target = "transactionId", source = "response.transactionId")
    CreateTransactionEvent toMapCreateEvent(TransactionRequest request, TransactionModelRepositoryResponse response);

    @Mapping(target = "transactionExternalId", source = "transactionId")
    @Mapping(target = "transactionType.name",
            source = "transferTypeId",
            qualifiedByName = "mapTransferType")
    @Mapping(target = "transactionStatus.name",
            source = "status")
    @Mapping(target = "createdAt", source = "createAt")
    TransactionDetailResponse toGetTransactions(TransactionRepositoryResponse response);

    @Named("mapTransferType")
    default String mapTransferType(Integer transferTypeId) {
        if (transferTypeId == null) {
            return "UNKNOWN";
        }
        return switch (transferTypeId) {
            case 1 -> "TRANSFER";
            case 2 -> "PAYMENT";
            default -> "UNKNOWN";
        };
    }
}
