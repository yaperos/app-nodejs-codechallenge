package com.codeh.transaction_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TransactionResponse {

    private UUID transactionExternalId;
    private TransactionTypeResponse transactionType;
    private TransactionStatusResponse transactionStatus;
    private BigDecimal value;
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
}