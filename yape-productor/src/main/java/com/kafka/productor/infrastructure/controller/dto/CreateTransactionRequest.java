package com.kafka.productor.infrastructure.controller.dto;

import java.util.UUID;

import com.kafka.productor.application.usecase.command.CreateTransactionCommand;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateTransactionRequest(
        @NotNull UUID accountExternalIdDebit,

        @NotNull UUID accountExternalIdCredit,

        @NotNull Long transferTypeId,

        @NotNull @Positive double value

) {

    public CreateTransactionCommand toCommand() {
        return new CreateTransactionCommand(
                accountExternalIdDebit,
                accountExternalIdCredit,
                transferTypeId,
                value);
    }
}