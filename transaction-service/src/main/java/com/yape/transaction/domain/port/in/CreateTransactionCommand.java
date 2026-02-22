package com.yape.transaction.domain.port.in;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateTransactionCommand(
        UUID accountExternalIdDebit,
        UUID accountExternalIdCredit,
        Integer transferTypeId,
        BigDecimal value
) {}
