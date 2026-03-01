package com.yape.transactions.dto.request;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionRequest(
        UUID accountExternalIdDebit,
        UUID accountExternalIdCredit,
        Integer transferTypeId,
        BigDecimal value
) {}
