package com.joma.transaction.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Table("transactions")
public record Transaction(
        @Id
        String transactionExternalId,
        String accountExternalIdDebit,
        String accountExternalIdCredit,
        String transactionName, //1=transferencia,2=pagos,3=compras
        BigDecimal amount,
        String transactionStatus,
        Instant createdAt
) {
}