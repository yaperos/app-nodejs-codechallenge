package com.yape.transactions.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record CreateTransactionRequest(
    @NotBlank String accountExternalIdDebit,
    @NotBlank String accountExternalIdCredit,
    @JsonProperty("tranferTypeId") @NotNull Integer tranferTypeId,
    @NotNull @PositiveOrZero BigDecimal value
) {}
