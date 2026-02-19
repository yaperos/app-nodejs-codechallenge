package com.yape.yape.application.mapper;

import com.yape.yape.application.dto.TransactionResponseDto;
import com.yape.yape.domain.model.Transaction;

public final class TransactionResponseMapper {

    private TransactionResponseMapper() {}

    public static TransactionResponseDto toDto(Transaction t) {
        return TransactionResponseDto.builder()
                .transactionExternalId(t.getTransactionExternalId())
                .transactionType(TransactionResponseDto.TransactionTypeDto.builder()
                        .name(t.getTransactionType().name())
                        .build())
                .transactionStatus(TransactionResponseDto.TransactionStatusDto.builder()
                        .name(t.getStatus().name())
                        .build())
                .value(t.getValue())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
