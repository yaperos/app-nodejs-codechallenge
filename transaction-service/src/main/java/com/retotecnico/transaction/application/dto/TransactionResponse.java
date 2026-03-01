package com.retotecnico.transaction.application.dto;

import com.retotecnico.transaction.domain.model.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse implements Serializable {

    private UUID transactionExternalId;
    private TransactionTypeDto transactionType;
    private TransactionStatusDto transactionStatus;
    private BigDecimal value;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionTypeDto implements Serializable {
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionStatusDto implements Serializable {
        private String name;
    }

    public static TransactionResponse fromDomain(Transaction transaction) {
        return TransactionResponse.builder()
                .transactionExternalId(transaction.getTransactionExternalId())
                .transactionType(TransactionTypeDto.builder()
                        .name(transaction.getTransferType().getName())
                        .build())
                .transactionStatus(TransactionStatusDto.builder()
                        .name(transaction.getStatus().name().toLowerCase())
                        .build())
                .value(transaction.getValue())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
