package com.yape.transaction.infrastructure.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    @JsonProperty("transactionExternalId")
    private UUID transactionExternalId;

    @JsonProperty("transactionType")
    private TransactionTypeResponse transactionType;

    @JsonProperty("transactionStatus")
    private TransactionStatusResponse transactionStatus;

    @JsonProperty("value")
    private BigDecimal value;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionTypeResponse {

        @JsonProperty("name")
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionStatusResponse {

        @JsonProperty("name")
        private String name;
    }
}
