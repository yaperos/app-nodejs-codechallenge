package com.kafka.productor.application.usecase.command;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateTransactionCommand(
    @NotNull UUID accountExternalIdDebit,

    @NotNull UUID accountExternalIdCredit,

    @NotNull Long transferTypeId,

    @NotNull @Positive double value) {
}
