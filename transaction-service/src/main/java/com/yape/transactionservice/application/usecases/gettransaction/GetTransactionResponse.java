package com.yape.transactionservice.application.usecases.gettransaction;

import java.math.BigDecimal;
import java.util.UUID;

public record GetTransactionResponse(UUID transactionExternalId,
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



