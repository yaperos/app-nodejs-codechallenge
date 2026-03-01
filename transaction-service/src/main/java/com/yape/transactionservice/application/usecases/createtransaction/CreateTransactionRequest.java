package com.yape.transactionservice.application.usecases.createtransaction;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateTransactionRequest(@NotNull(message = "accountExternalIdDebit is required")
                                       UUID accountExternalIdDebit,
                                       @NotNull(message = "accountExternalIdCredit is required")
                                       UUID accountExternalIdCredit,
                                       @NotNull(message = "transferTypeId is required")
                                       @Min(value = 1, message = "transferTypeId must be 1 or 2")
                                       @Max(value = 2, message = "transferTypeId must be 1 or 2")
                                       Integer transferTypeId,
                                       @NotNull(message = "value is required")
                                       @Positive(message = "value must be greater than 0")
                                       BigDecimal value
) {
}











