package com.devpull.transactionservice.application.dto.command;

import java.util.UUID;

public record CreateTransactionCommand(
        UUID accountExternalIdDebit,
        UUID accountExternalIdCredit,
        String transferTypeId,
        Double value
) {}
