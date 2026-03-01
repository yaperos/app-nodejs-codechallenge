package com.yape.transactionservice.application.usecases.createtransaction;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateTransactionResponse(
        UUID transactionExternalId,
        UUID accountExternalIdDebit,
        UUID accountExternalIdCredit,
        Integer transferTypeId,
        BigDecimal value) {
}
