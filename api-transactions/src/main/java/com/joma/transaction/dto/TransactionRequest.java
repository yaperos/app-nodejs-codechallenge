package com.joma.transaction.dto;

import java.math.BigDecimal;

public record TransactionRequest(
        String accountExternalIdDebit,
        String accountExternalIdCredit,
        int transferTypeId,
        BigDecimal amount
) {
}
