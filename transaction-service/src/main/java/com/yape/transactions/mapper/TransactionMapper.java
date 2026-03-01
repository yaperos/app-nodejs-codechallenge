package com.yape.transactions.mapper;

import com.yape.transactions.dto.request.TransactionRequest;
import com.yape.transactions.dto.response.TransactionResponse;
import com.yape.transactions.model.Transaction;
import com.yape.transactions.model.TransactionType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(source = "transferTypeId", target = "type")
    @Mapping(target = "createdAt", ignore = true)
    Transaction toEntity(TransactionRequest request);

    @Mapping(source = "id", target = "transactionExternalId")
    @Mapping(source = "type.name", target = "transactionType.name")
    @Mapping(source = "status.name", target = "transactionStatus.name")
    TransactionResponse toResponse(Transaction entity);

    default TransactionType mapType(Integer value) {
        if (value == null) return null;
        return TransactionType.fromId(value);
    }
}
