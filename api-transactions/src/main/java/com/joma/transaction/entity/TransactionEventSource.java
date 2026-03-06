package com.joma.transaction.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table(name = "transaction_events")
public record TransactionEventSource(
        @Id
        String transactionExternalId,
        String accountExternalIdDebit,
        String accountExternalIdCredit,
        String transactionName, //1=transferencia,2=pagos,3=compras
        BigDecimal amount,
        String transactionStatus,
        String version,
        LocalDateTime createdAt
) {
}