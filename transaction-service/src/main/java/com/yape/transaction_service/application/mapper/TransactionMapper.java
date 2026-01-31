package com.yape.transaction_service.application.mapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.yape.transaction_service.application.dto.CreateTransactionRequest;
import com.yape.transaction_service.application.dto.TransactionResponse;
import com.yape.transaction_service.application.dto.TransactionStatusDto;
import com.yape.transaction_service.application.dto.TransactionTypeDto;
import com.yape.transaction_service.domain.model.TransactionModel;
import com.yape.transaction_service.domain.model.TransactionStatusModel;
import com.yape.transaction_service.domain.model.TransactionTypeModel;

public class TransactionMapper {
    private TransactionMapper() {
    }

    public static TransactionModel toEntity(CreateTransactionRequest request) {
        TransactionModel entity = TransactionModel.builder()
                .transactionExternalId(UUID.randomUUID())
                .accountExternalIdDebit(request.getAccountExternalIdDebit())
                .accountExternalIdCredit(request.getAccountExternalIdCredit())
                .transferTypeId(request.getTranferTypeId())
                .value(request.getValue())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();
        return entity;

    }

    public static TransactionResponse toResponse(
            TransactionModel transaction,
            TransactionTypeModel type) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .transactionExternalId(transaction.getTransactionExternalId())
                .transactionType(new TransactionTypeDto(type.getName()))
                .value(transaction.getValue())
                .createdAt(transaction.getCreatedAt())
                .build();
    }

}
