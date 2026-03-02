package com.yape.transaction.application.mapper;

import com.yape.transaction.application.dto.CreateTransactionRequest;
import com.yape.transaction.application.dto.CreateTransactionResponse;
import com.yape.transaction.application.dto.GetTransactionResponse;
import com.yape.transaction.application.dto.BaseTransaction;
import com.yape.transaction.domain.entities.Transaction;
import com.yape.transaction.domain.enums.TransactionStatus;
import com.yape.transaction.domain.enums.TransactionType;
import com.yape.transaction.domain.model.EventOutbound;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TransactionMapper {

    private TransactionMapper() {}

    public static Transaction toEntity(CreateTransactionRequest request, TransactionType transactionType) {
        return Transaction.builder()
                .transactionExternalId(UUID.randomUUID().toString())
                .accountExternalIdDebit(request.getAccountExternalIdDebit())
                .accountExternalIdCredit(request.getAccountExternalIdCredit())
                .type(transactionType.name())
                .status(TransactionStatus.PENDING.getValue())
                .value(request.getValue())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public static EventOutbound toEventOutbound(Transaction transaction) {
        return EventOutbound.builder()
                .id(transaction.getId())
                .value(transaction.getValue())
                .transactionExternalId(transaction.getTransactionExternalId())
                .status(transaction.getStatus())
                .build();
    }

    public static CreateTransactionResponse toCreateResponse(Transaction transaction) {
        return CreateTransactionResponse.builder()
                .transactionExternalId(transaction.getTransactionExternalId())
                .build();
    }

    public static GetTransactionResponse toGetResponse(Transaction transaction) {
        return GetTransactionResponse.builder()
                .transactionExternalId(transaction.getTransactionExternalId())
                .value(transaction.getValue())
                .createdAt(transaction.getCreatedAt())
                .transactionStatus(new BaseTransaction(transaction.getStatus()))
                .transactionType(new BaseTransaction(transaction.getType()))
                .build();
    }
}

