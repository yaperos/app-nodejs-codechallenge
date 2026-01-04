package com.yape.challenge.transaction.domain.event;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.yape.challenge.common.dto.TransactionStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain event fired when a transaction status changes
 */
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionStatusChangedDomainEvent implements TransactionDomainEvent {
    private final UUID aggregateId;
    private final TransactionStatus oldStatus;
    private final TransactionStatus newStatus;
    private final String reason;
    private final LocalDateTime occurredAt;

    @JsonCreator
    public TransactionStatusChangedDomainEvent(
            @JsonProperty("aggregateId") UUID aggregateId,
            @JsonProperty("oldStatus") TransactionStatus oldStatus,
            @JsonProperty("newStatus") TransactionStatus newStatus,
            @JsonProperty("reason") String reason,
            @JsonProperty("occurredAt") LocalDateTime occurredAt) {
        this.aggregateId = aggregateId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.reason = reason;
        this.occurredAt = occurredAt;
    }

    @Override
    public String getEventType() {
        return "TransactionStatusChangedDomainEvent";
    }
}

