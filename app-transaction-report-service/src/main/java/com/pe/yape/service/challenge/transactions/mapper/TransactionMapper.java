package com.pe.yape.service.challenge.transactions.mapper;

import com.pe.yape.service.challenge.transactions.domain.model.Transaction;
import com.pe.yape.service.challenge.transactions.dto.TransactionResponse;
import com.pe.yape.service.challenge.transactions.dto.TransactionStatus;
import com.pe.yape.service.challenge.transactions.dto.TransactionType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "transactionExternalId", expression = "java(transaction.getTransactionExternalId().toString())")
    @Mapping(target = "transactionType", expression = "java(mapType(transaction.getTransferTypeId()))")
    @Mapping(target = "transactionStatus", expression = "java(mapStatus(transaction.getStatus()))")
    @Mapping(target = "value", expression = "java(BigDecimal.valueOf(transaction.getValue()))")
    @Mapping(target = "createdAt", expression = "java(toLocalDateTime(transaction.getCreatedAt()))")
    TransactionResponse toResponse(Transaction transaction);

    default LocalDateTime toLocalDateTime(OffsetDateTime odt) {
        return odt == null ? null : odt.toLocalDateTime();
    }

    default TransactionType mapType(Integer id) {
        return new TransactionType(resolveTypeName(id));
    }

    default TransactionStatus mapStatus(String status) {
        return new TransactionStatus(status);
    }

    private static String resolveTypeName(Integer id) {
        return switch (id) {
            case 1 -> "DEPOSIT";
            case 2 -> "TRANSFER";
            case 3 -> "PAYMENT";
            default -> "UNKNOWN";
        };
    }
}
