package com.yape.challenge.transaction.infrastructure.adapters.in.web.dto;

import com.yape.challenge.transaction.domain.model.Transaction;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TransactionResponse {
    private UUID transactionExternalId;
    private TransactionTypeResponse transactionType;
    private TransactionStatusResponse transactionStatus;
    private Double value;
    private LocalDateTime createdAt;

    @Data
    @Builder
    public static class TransactionTypeResponse {
        private String name;
    }

    @Data
    @Builder
    public static class TransactionStatusResponse {
        private String name;
    }

    public static TransactionResponse fromDomain(Transaction transaction) {
        if (transaction == null)
            return null;

        return TransactionResponse.builder()
                .transactionExternalId(transaction.getId())
                .transactionType(TransactionTypeResponse.builder()
                        .name(String.valueOf(transaction.getTranferTypeId())) // Or map to actual name if needed
                        .build())
                .transactionStatus(TransactionStatusResponse.builder()
                        .name(transaction.getStatus().name())
                        .build())
                .value(transaction.getValue())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
