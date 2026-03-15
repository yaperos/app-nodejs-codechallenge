package com.challenge.transaction.app.mapper;

import com.challenge.transaction.app.dto.CreateTransactionRequest;
import com.challenge.transaction.app.dto.TransactionResponse;
import com.challenge.transaction.core.domain.enums.TransactionStatus;
import com.challenge.transaction.core.domain.model.Transaction;
import com.challenge.transaction.core.domain.model.TransactionType;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;

@Component
public interface TransactionMapper {
    TransactionMapper MAPPER = Mappers.getMapper(TransactionMapper.class);

    @Mapping(target = "transactionType", source = "transferTypeId", qualifiedByName = "toTransactionType")
    Transaction toDomain(CreateTransactionRequest request);

    @Mapping(target = "transactionStatus", source = "status", qualifiedByName = "toTransactionStatus")
    @Mapping(target = "transactionType", source = "transactionType", qualifiedByName = "toTransactionTypeName")
    TransactionResponse toResponse(Transaction transaction);

    @Named("toTransactionStatus")
    default TransactionResponse.StatusDto toTransactionStatus(TransactionStatus status) {
        TransactionResponse.StatusDto statusDto = new TransactionResponse.StatusDto();
        statusDto.setName(status.name());

        return statusDto;
    }

    @Named("toTransactionType")
    default TransactionType toTransactionType(Integer transferTypeId) {
        return TransactionType.fromId(transferTypeId);
    }

    @Named("toTransactionTypeName")
    default TransactionResponse.TypeDto toTransactionTypeName(TransactionType transactionType) {
        TransactionResponse.TypeDto typeDto = new TransactionResponse.TypeDto();
        typeDto.setName(transactionType.name());

        return typeDto;
    }
}
