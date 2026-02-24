package pe.yape.transactions.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransactionResponse(
        UUID transactionExternalId,
        NameDto transactionType,
        NameDto transactionStatus,
        BigDecimal value,
        LocalDateTime createdAt
) {}