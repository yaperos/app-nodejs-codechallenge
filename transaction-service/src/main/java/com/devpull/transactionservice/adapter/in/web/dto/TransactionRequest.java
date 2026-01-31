package com.devpull.transactionservice.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record TransactionRequest(
        @NotNull  UUID accountExternalIdDebit,
        @NotNull UUID accountExternalIdCredit,
        @NotBlank String transferTypeId,
        @NotNull Double value
) {}
