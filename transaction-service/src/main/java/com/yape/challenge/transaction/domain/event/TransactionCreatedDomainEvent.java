package com.yape.challenge.transaction.domain.event;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain event fired when a transaction is created
 */
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionCreatedDomainEvent implements TransactionDomainEvent {
    private final UUID aggregateId;
    private final UUID accountExternalIdDebit;
    private final UUID accountExternalIdCredit;
    private final Integer transferTypeId;
    private final BigDecimal value;
    private final LocalDateTime occurredAt;

    @JsonCreator
    public TransactionCreatedDomainEvent(
            @JsonProperty("aggregateId") UUID aggregateId,
            @JsonProperty("accountExternalIdDebit") UUID accountExternalIdDebit,
            @JsonProperty("accountExternalIdCredit") UUID accountExternalIdCredit,
            @JsonProperty("transferTypeId") Integer transferTypeId,
            @JsonProperty("value") BigDecimal value,
            @JsonProperty("occurredAt") LocalDateTime occurredAt) {
        this.aggregateId = aggregateId;
        this.accountExternalIdDebit = accountExternalIdDebit;
        this.accountExternalIdCredit = accountExternalIdCredit;
        this.transferTypeId = transferTypeId;
        this.value = value;
        this.occurredAt = occurredAt;
    }

    @Override
    public String getEventType() {
        return "TransactionCreatedDomainEvent";
    }
}

