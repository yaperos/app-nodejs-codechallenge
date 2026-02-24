package pe.yape.transactions.api.dto;

import java.util.UUID;

public record CreateTransactionResponse(
        UUID transactionExternalId,
        NameDto transactionStatus
) {}