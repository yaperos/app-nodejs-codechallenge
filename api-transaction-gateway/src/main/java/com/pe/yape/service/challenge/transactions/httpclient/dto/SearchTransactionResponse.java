package com.pe.yape.service.challenge.transactions.httpclient.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SearchTransactionResponse(String transactionExternalId, TransactionType transactionType,
                                        TransactionStatus transactionStatus, BigDecimal value,
                                        LocalDateTime createdAt) {
}
