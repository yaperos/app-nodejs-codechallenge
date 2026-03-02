package com.yape.transaction.infrastructure.kafka.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatusUpdatedEvent {

    @JsonProperty("transactionId")
    private UUID transactionId;

    @JsonProperty("status")
    private String status;
}
