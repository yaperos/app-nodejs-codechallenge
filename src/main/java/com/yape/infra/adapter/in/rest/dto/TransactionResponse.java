package com.yape.infra.adapter.in.rest.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.yape.domain.model.Transaction;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransactionResponse {
    private UUID transactionExternalId;
    private TransactionTypeDto transactionType;
    private TransactionStatusDto transactionStatus;
    private BigDecimal value;
    private LocalDateTime createdAt;

    @Data
    @Builder
    public static class TransactionTypeDto {
        private String name;
    }

    @Data
    @Builder
    public static class TransactionStatusDto {
        private String name;
    }

    public static TransactionResponse fromDomain(Transaction transaction) {
        return TransactionResponse.builder()
                .transactionExternalId(transaction.getTransactionExternalId())
                .transactionType(TransactionTypeDto.builder()
                        .name(transaction.getTransferTypeId() == 1 ? "TRANSFER" : "UNKNOWN")
                        .build())
                .transactionStatus(TransactionStatusDto.builder()
                        .name(transaction.getStatus().name())
                        .build())
                .value(transaction.getValue())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
