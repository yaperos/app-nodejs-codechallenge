package com.yape.antifraud.kafka;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public record TransactionCreatedEvent(
    String transactionExternalId,
    String accountExternalIdDebit,
    String accountExternalIdCredit,
    @JsonProperty("tranferTypeId") Integer tranferTypeId,
    BigDecimal value
) {}
