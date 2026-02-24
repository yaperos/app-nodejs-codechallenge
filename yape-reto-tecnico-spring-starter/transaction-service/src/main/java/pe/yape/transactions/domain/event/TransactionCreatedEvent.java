package pe.yape.transactions.domain.event;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionCreatedEvent(
        UUID transactionExternalId,
        UUID accountExternalIdDebit,
        UUID accountExternalIdCredit,
        Integer tranferTypeId,
        BigDecimal value
) {}