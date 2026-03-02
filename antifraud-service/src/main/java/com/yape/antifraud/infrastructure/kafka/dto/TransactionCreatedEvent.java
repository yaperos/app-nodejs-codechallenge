package com.yape.antifraud.infrastructure.kafka.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO representing a transaction creation event consumed from Kafka.
 * Maps to the event published by the transaction-service when a new transaction is created.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionCreatedEvent {

    @JsonProperty("transactionId")
    private String transactionId;

    @JsonProperty("value")
    private BigDecimal value;

    @JsonProperty("transactionTypeId")
    private int transactionTypeId;

    @JsonProperty("accountExternalIdDebit")
    private String accountExternalIdDebit;

    @JsonProperty("accountExternalIdCredit")
    private String accountExternalIdCredit;

    @JsonProperty("createdAt")
    private String createdAt;
}
