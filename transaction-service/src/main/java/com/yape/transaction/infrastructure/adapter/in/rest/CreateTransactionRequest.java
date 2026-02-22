package com.yape.transaction.infrastructure.adapter.in.rest;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

public record CreateTransactionRequest(
        @NotNull(message = "accountExternalIdDebit is required")
        UUID accountExternalIdDebit,

        @NotNull(message = "accountExternalIdCredit is required")
        UUID accountExternalIdCredit,

        @NotNull(message = "transferTypeId is required")
        @JsonAlias("tranferTypeId")
        Integer transferTypeId,

        @NotNull(message = "value is required")
        @Positive(message = "value must be positive")
        @DecimalMax(value = "999999999.99", message = "value exceeds maximum allowed amount")
        BigDecimal value
) {}
