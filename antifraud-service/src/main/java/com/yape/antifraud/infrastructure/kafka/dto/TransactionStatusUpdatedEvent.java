package com.yape.antifraud.infrastructure.kafka.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a transaction status update event published to Kafka.
 * Sent after the anti-fraud evaluation is completed.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatusUpdatedEvent {

    @JsonProperty("transactionId")
    private String transactionId;

    @JsonProperty("status")
    private String status;
}
