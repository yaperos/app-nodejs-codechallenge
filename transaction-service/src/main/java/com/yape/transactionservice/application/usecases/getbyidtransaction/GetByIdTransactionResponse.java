package com.yape.transactionservice.application.usecases.getbyidtransaction;

import com.yape.transactionservice.application.usecases.gettransaction.GetTransactionResponse;

import java.math.BigDecimal;
import java.util.UUID;

public record GetByIdTransactionResponse(UUID transactionExternalId,
                                         UUID accountExternalIdDebit,
                                         UUID accountExternalIdCredit,
                                         TransactionTypeDto transactionType,
                                         TransactionStatusDto transactionStatus,
                                         BigDecimal value) {
    public record TransactionTypeDto(String name) {
    }

    public record TransactionStatusDto(String name) {
    }
}
