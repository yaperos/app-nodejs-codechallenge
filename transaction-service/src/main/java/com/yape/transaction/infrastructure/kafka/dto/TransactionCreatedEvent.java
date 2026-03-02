package com.yape.transaction.infrastructure.kafka.dto;

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
public class TransactionCreatedEvent {

    @JsonProperty("transactionId")
    private UUID transactionId;

    @JsonProperty("value")
    private BigDecimal value;

    @JsonProperty("transactionTypeId")
    private int transactionTypeId;

    @JsonProperty("accountExternalIdDebit")
    private UUID accountExternalIdDebit;

    @JsonProperty("accountExternalIdCredit")
    private UUID accountExternalIdCredit;

    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
}
