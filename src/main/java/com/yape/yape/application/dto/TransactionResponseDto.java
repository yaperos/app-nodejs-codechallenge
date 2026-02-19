package com.yape.yape.application.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponseDto {

    private UUID transactionExternalId;
    private TransactionTypeDto transactionType;
    private TransactionStatusDto transactionStatus;
    private BigDecimal value;
    private Instant createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TransactionTypeDto {
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TransactionStatusDto {
        private String name;
    }
}
