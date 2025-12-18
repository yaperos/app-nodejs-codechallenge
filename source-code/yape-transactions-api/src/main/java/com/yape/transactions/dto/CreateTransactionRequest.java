package com.yape.transactions.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreateTransactionRequest(
        @NotBlank String accountExternalIdDebit,
        @NotBlank String accountExternalIdCredit,
        @NotNull Integer tranferTypeId,
        @NotNull @DecimalMin("0.01") BigDecimal value
) {}
